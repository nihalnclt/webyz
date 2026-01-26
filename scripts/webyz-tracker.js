(function (window, document) {
  const config = {
    siteId: "",
    endPoint: "",
    domain: "",
    autoTrack: true,
    trackLocalhost: false,
    excludeSearch: false,
    excludeHash: false,
    respectDNT: false,
    debug: false,
  };

  let state = {
    initialized: false,
    disabled: false,
    currentUrl: "",
    currentRef: "",
    sessionId: "",
    visitorId: "",
    lastActivity: Date.now(),
    pageviewId: "",
  };

  const SCRIPT_NAME = "webyz-tracker";
  const COOKIE_NAME = "_webyz";
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const DNT_VALUES = ["1", 1, "yes", true];

  const utils = {
    generateId: () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    timestamp: () => Math.floor(Date.now() / 1000),

    stringify: (obj) => {
      const params = new URLSearchParams();
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
      return params.toString();
    },

    getCookie: (name) => {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");
        if (decodeURIComponent(cookieName) === name) {
          try {
            return JSON.parse(decodeURIComponent(cookieValue));
          } catch (e) {
            return decodeURIComponent(cookieValue);
          }
        }
      }
      return null;
    },

    setCookie: (name, value, options = {}) => {
      const expires =
        options.expires || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const path = options.path || "/";
      const secure = options.secure !== false;
      const sameSite = options.sameSite || "Lax";

      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
        JSON.stringify(value)
      )}`;
      cookieString += `;expires=${expires.toUTCString()}`;
      cookieString += `;path=${path}`;
      if (secure && location.protocol === "https:") {
        cookieString += ";Secure";
      }
      cookieString += `;SameSite=${sameSite}`;

      document.cookie = cookieString;
    },

    shouldIgnore: () => {
      if (config.respectDNT && utils.hasDoNotTrack()) {
        return "DNT enabled";
      }

      if (!config.trackLocalhost && utils.isLocalhost()) {
        return "localhost";
      }

      try {
        if (localStorage.getItem(`${SCRIPT_NAME}-disabled`) === "true") {
          return "disabled in localStorage";
        }
      } catch (e) {}

      if (document.visibilityState === "prerender") {
        return "prerendered page";
      }

      if (utils.isBot()) {
        return "bot detected";
      }

      return false;
    },

    hasDoNotTrack: () => {
      const dnt =
        navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
      return DNT_VALUES.includes(dnt);
    },

    isLocalhost: () => {
      return (
        /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(
          location.hostname
        ) || location.protocol === "file:"
      );
    },

    isBot: () => {
      return !!(
        window._phantom ||
        window.__nightmare ||
        window.navigator.webdriver ||
        window.Cypress ||
        /bot|crawler|spider|crawling/i.test(navigator.userAgent)
      );
    },

    getScreen: () => `${screen.width}x${screen.height}`,

    getPageData: () => {
      const url = location.href;
      const path = location.pathname + location.search;

      const canonical = document.querySelector('link[rel="canonical"][href]');
      if (canonical) {
        try {
          const canonicalUrl = new URL(canonical.href, location.href);
          url = canonicalUrl.href;
          path = canonicalUrl.pathname + canonicalUrl.search;
        } catch (e) {}
      }

      if (config.excludeSearch) {
        url = location.origin + location.pathname;
        path = location.pathname;
      }

      if (config.excludeHash) {
        url = url.split("#")[0];
        path = path.split("#")[0];
      }

      return { url, path };
    },

    getReferrer: () => {
      const ref = document.referrer;
      if (!ref || ref.indexOf(location.origin) === 0) {
        return "";
      }
      return ref;
    },

    log: (...args) => {
      if (config.debug) {
        console.log(`[${SCRIPT_NAME}]`, ...args);
      }
    },
  };

  const session = {
    init: () => {
      const stored = utils.getCookie(COOKIE_NAME);
      const now = Date.now();

      if (stored && now - stored.lastActivity < SESSION_TIMEOUT) {
        state.sessionId = stored.sessionId;
        state.visitorId = stored.visitorId;
        state.lastActivity = now;
        session.save();
      } else {
        session.create();
      }
    },

    create: () => {
      state.sessionId = utils.generateId();
      state.visitorId = state.visitorId || utils.generateId();
      state.lastActivity = Date.now;
      session.save();
    },

    save: () => {
      utils.setCookie(COOKIE_NAME, {
        sessionId: state.sessionId,
        visitorId: state.visitorId,
        lastActivity: state.lastActivity,
      });
    },

    isNewSession: () => {
      const stored = utils.getCookie(COOKIE_NAME);
      return !stored || stored.sessionId !== state.sessionId;
    },

    isNewVisitor: () => {
      const stored = utils.getCookie(COOKIE_NAME);
      return !stored;
    },
  };

  const network = {
    send: (payload) => {
      if (!config.endPoint || !config.siteId) {
        utils.log("Missing endpoint or siteId");
        return Promise.resolve();
      }

      const ignoreReason = utils.shouldIgnore();
      if (ignoreReason) {
        utils.log("Ignoring request:", ignoreReason);
        return Promise.resolve();
      }

      return network.send;
    },

    sendBeacon: (payload) => {
      if (!navigator.sendBeacon) {
        throw new Error("sendBeacon not supported");
      }

      const body = JSON.stringify(payload);
      const sent = navigator.sendBeacon(config.endPoint, body);

      if (sent) {
        utils.log("Sent via beacon (POST):", payload);
        return Promise.resolve();
      } else {
        throw new Error("sendBeacon failed");
      }
    },

    sendFetch: (payload) => {
      if (!window.fetch) {
        throw new Error("fetch not supported");
      }

      return fetch(config.endPoint, {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "omit",
      }).then((response) => {
        if (response.ok) {
          utils.log("Sent via fetch (POST):", payload);
          return Promise.resolve();
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      });
    },

    sendImage: (payload) => {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        const url = `${config.endPoint}?${utils.stringify(payload)}`;

        img.onload = () => {
          utils.log("Sent via image:", payload);
          resolve();
        };

        img.onerror = () => {
          utils.log("Image request failed");
          reject(new Error("Image request failed"));
        };

        // Cleanup after timeout
        setTimeout(() => {
          if (img.parentNode) {
            document.body.removeChild(img);
          }
        }, 1000);

        img.style.position = "absolute";
        img.style.left = "-9999px";
        img.style.width = "1px";
        img.style.height = "1px";
        img.src = url;

        if (document.body) {
          document.body.appendChild(img);
        } else {
          document.addEventListener("DOMContentLoaded", () => {
            if (document.body) {
              document.body.appendChild(img);
            }
          });
        }
      });
    },
  };

  const tracker = {
    pageview: (customData = {}) => {
      const pageData = utils.getPageData();
      const isNew = session.isNewSession();
      const isNewVisitor = session.isNewVisitor();

      if (state.currentUrl === pageData.url && !customData.force) {
        utils.log("Duplicate pageview ignored");
        return;
      }

      state.currentUrl = pageData.url;
      state.currentRef = utils.getReferrer();
      state.pageviewId = utils.generateId();

      const payload = {
        t: "pageview",
        sid: config.siteId,
        vid: state.visitorId,
        ssid: state.sessionId,
        pid: state.pageviewId,
        url: pageData.url,
        path: pageData.path,
        ref: state.currentRef,
        title: document.title,
        lang: navigator.language,
        screen: utils.getScreen(),
        ts: utils.timestamp(),
        new_visitor: isNewVisitor ? 1 : 0,
        new_session: isNew ? 1 : 0,
        ...customData,
      };

      return network.send(payload);
    },

    event: (name, data = {}) => {
      if (!name || typeof name !== "string") {
        utils.log("Event name is required and must be a string");
        return;
      }

      const payload = {
        t: "event",
        sid: config.siteId,
        vid: state.visitorId,
        ssid: state.sessionId,
        pid: state.pageviewId,
        name: name,
        url: state.currentUrl,
        ts: utils.timestamp(),
        ...data,
      };

      return network.send(payload);
    },
  };

  const autotrack = {
    init: () => {
      if (config.autoTrack) {
        autotrack.setupPageviews();
        autotrack.setupClicks();
      }
    },

    setupPageviews: () => {
      if (document.readyState === "complete") {
        tracker.pageview();
      } else {
        window.addEventListener("load", () => tracker.pageview());
      }

      autotrack.hookHistory();
    },

    hookHistory: () => {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(() => tracker.pageview(), 100);
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(() => tracker.pageview(), 100);
      };

      window.addEventListener("popstate", () => {
        setTimeout(() => tracker.pageview(), 100);
      });
    },

    setupClicks: () => {
      document.addEventListener("click", autotrack.handleClick, true);
    },

    handleClick: (event) => {
      const element = event.target.closest("[data-analytics-event]");
      if (!element) return;

      const eventName = element.getAttribute("data-analytics-event");
      if (!eventName) return;

      const eventData = {};
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-analytics-")) {
          const key = attr.name
            .replace("data-analytics-", "")
            .replace(/-/g, "_");
          if (key !== "event") {
            eventData[key] = attr.value;
          }
        }
      });

      if (element.tagName === "A" && element.href) {
        const isExternal =
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          (event.button && event.button === 1);

        if (!isExternal) {
          event.preventDefault();
          tracker.event(eventName, eventData).finally(() => {
            location.href = element.href;
          });
          return;
        }

        tracker.event(eventName, eventData);
      }
    },
  };

  const init = () => {
    if (state.initialized) return;

    const script =
      document.currentScript ||
      document.querySelector(`script[src*="${SCRIPT_NAME}"]`);

    console.log("debug", config.debug, script);

    if (script) {
      config.siteId = script.getAttribute("data-site-id") || config.siteId;
      config.endPoint = script.getAttribute("data-endpoint") || config.endPoint;
      config.domain =
        script.getAttribute("data-domain") ||
        config.domain ||
        location.hostname;
      config.autoTrack = script.getAttribute("data-auto-track") !== "false";
      config.trackLocalhost =
        script.getAttribute("data-track-localhost") === "true";
      config.excludeSearch =
        script.getAttribute("data-exclude-search") === "true";
      config.excludeHash = script.getAttribute("data-exclude-hash") === "true";
      config.respectDNT = script.getAttribute("data-respect-dnt") !== "false";
      config.debug = script.getAttribute("data-debug") === "true";
    }

    session.init();

    autotrack.init();

    state.initialized = true;
    utils.log("Tracker initialized", config);
  };

  const api = {};

  window.webyz = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
