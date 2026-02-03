import { FastifyRequest } from "fastify";

import { TrackingPayload } from "../types.js";
import { extractClientInfoFromRequest } from "../http/extract-client-info.js";
import { extractHostname } from "../../utils/hostname.js";
import { isBot } from "../../utils/bot-detection.js";
import { EventInput } from "../../core/tracker/types.js";
import { normalizeUtm } from "../helpers/utm.js";
import { normalizeGeo } from "../helpers/geo.js";
import { normalizeMeta } from "../helpers/meta.js";
import { normalizeUrlData } from "../helpers/url.js";
import { parseUserAgent } from "../user-agent/parse-user-agent.js";

export const normalizeTracking = async (
  payload: TrackingPayload,
  request: FastifyRequest,
) => {
  // Extract client information
  const clientInfo = extractClientInfoFromRequest(request);
  const uaInfo = parseUserAgent(clientInfo.userAgent);
  const hostname = extractHostname(payload.url, request);

  // Bot detection
  if (isBot(clientInfo.userAgent)) {
    throw new Error("Bot traffic detected");
  }

  const timestamp = payload.ts ? new Date(payload.ts * 1000) : new Date();

  return {
    input: {
      websiteId: payload.sid,
      sessionId: payload.ssid,
      userId: payload.vid,
      eventType: payload.t,
      eventName:
        payload.t === "event" ? payload.name || "custom_event" : "pageview",
      timestamp,
      hostname,
      url: normalizeUrlData(payload?.url, payload?.ref, hostname),
      utm: normalizeUtm(payload?.url, hostname),
      geo: await normalizeGeo(clientInfo.ip),
      meta: normalizeMeta(payload),
      client: { ip: clientInfo.ip, deviceType: clientInfo.deviceType },
      page: {
        title: payload.title || "",
        screen: payload.screen || "",
        language: payload.lang || "",
      },
      userAgent: { browser: clientInfo.browser, os: clientInfo.os },
    },
    uaInfo,
    isPageView: payload.t === "pageview",
    newSession: payload.new_session === 1 || payload.new_session === "1",
  };
};
