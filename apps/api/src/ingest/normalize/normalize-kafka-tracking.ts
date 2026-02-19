import { normalizeGeo } from "../../core/geo/index.js";
import { isBot } from "../../utils/bot-detection.js";
import { extractHostname } from "../../utils/hostname.js";
import { normalizeMeta } from "../helpers/meta.js";
import { normalizeUrlData } from "../helpers/url.js";
import { normalizeUtm } from "../helpers/utm.js";
import { TrackingPayload } from "../types.js";
import { parseUserAgent } from "../user-agent/parse-user-agent.js";

export type KafkaTrackingMessage = {
  payload: TrackingPayload;
  headers?: Record<string, string>;
  ip?: string;
};

export const normalizeKafkaTracking = async (message: KafkaTrackingMessage) => {
  const userAgent = message.headers?.["user-agent"] ?? "";
  if (isBot(userAgent)) return null;

  const uaInfo = parseUserAgent(userAgent);
  const hostname = extractHostname(message.payload.url, {
    headers: message.headers,
  } as any);

  const timestamp = message.payload.ts
    ? new Date(message.payload.ts * 1000)
    : new Date();

  return {
    input: {
      websiteId: message.payload.sid,
      sessionId: message.payload.ssid,
      userId: message.payload.vid,
      eventType: message.payload.t,
      eventName:
        message.payload.t === "event"
          ? message.payload.name || "custom_event"
          : "pageview",
      timestamp,
      hostname,
      url: normalizeUrlData(
        message.payload?.url,
        message.payload?.ref,
        hostname,
      ),
      utm: normalizeUtm(message.payload?.url, hostname),
      geo: await normalizeGeo(message.ip ?? "0.0.0.0"),
      meta: normalizeMeta(message.payload),
      client: { deviceType: uaInfo.deviceType, ip: message.ip ?? "0.0.0.0" },
      page: {
        title: message.payload.title || "",
        screen: message.payload.screen || "",
        language: message.payload.lang || "",
      },
      userAgent: uaInfo as any,
    },
    uaInfo,
    isPageView: message.payload.t === "pageview",
    newSession:
      message.payload.new_session === 1 || message.payload.new_session === "1",
  };
};
