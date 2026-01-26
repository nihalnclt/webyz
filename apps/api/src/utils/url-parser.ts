export const parseUrlData = (
  url?: string,
  referrer?: string,
  hostname?: string
) => {
  const base = hostname ? `https://${hostname}` : "http://localhost";

  let urlPath = "";
  let urlQuery = "";
  let referrerPath = "";
  let referrerQuery = "";
  let referrerDomain = "";

  if (url) {
    try {
      const currentUrl = new URL(url, base);
      urlPath =
        currentUrl.pathname === "/undefined"
          ? ""
          : currentUrl.pathname + currentUrl.hash;
      urlQuery = currentUrl.search.substring(1);
    } catch (err) {
      urlPath = url;
    }
  }

  if (referrer) {
    try {
      const referrerUrl = new URL(referrer, base);
      referrerPath = referrerUrl.pathname;
      referrerQuery = referrerUrl.search.substring(1);

      if (referrerUrl.hostname !== "localhost") {
        referrerDomain = referrerUrl.hostname.replace(/^www\./, "");
      }
    } catch (error) {
      referrerPath = referrer;
    }
  }

  return {
    urlPath,
    urlQuery,
    referrerPath,
    referrerQuery,
    referrerDomain,
  };
};

export const extractUtmParams = (url?: string, hostname?: string) => {
  if (!url) return {};

  const base = hostname ? `https://${hostname}` : "https://localhost";

  try {
    const currentUrl = new URL(url, base);

    return {
      utmSource: currentUrl.searchParams.get("utm_source") || undefined,
      utmMedium: currentUrl.searchParams.get("utm_medium") || undefined,
      utmCampaign: currentUrl.searchParams.get("utm_campaign") || undefined,
      utmContent: currentUrl.searchParams.get("utm_content") || undefined,
      utmTerm: currentUrl.searchParams.get("utm_term") || undefined,
    };
  } catch (error) {
    return {};
  }
};

export const extractClickIds = (url?: string, hostname?: string) => {
  if (!url) return {};

  const base = hostname ? `https://${hostname}` : "https://localhost";

  try {
    const currentUrl = new URL(url, base);

    return {
      gclid: currentUrl.searchParams.get("gclid") || undefined,
      fbclid: currentUrl.searchParams.get("fbclid") || undefined,
      msclkid: currentUrl.searchParams.get("msclkid") || undefined,
      ttclid: currentUrl.searchParams.get("ttclid") || undefined,
      lifatid: currentUrl.searchParams.get("li_fat_id") || undefined,
      twclid: currentUrl.searchParams.get("twclid") || undefined,
    };
  } catch (error) {
    return {};
  }
};

export const sanitizeUrlPath = (
  urlPath: string,
  removeTrailingSlash: boolean
): string => {
  if (removeTrailingSlash) {
    return urlPath.replace(/\/(?=(#.*)?$)/, "");
  }
  return urlPath;
};

export const safeDecodeURI = (str?: string): string => {
  if (!str) return "";
  try {
    return decodeURI(str);
  } catch (error) {
    return str;
  }
};

export const safeDecodeURIComponent = (str?: string): string => {
  if (!str) return "";
  try {
    return decodeURIComponent(str);
  } catch (error) {
    return str;
  }
};
