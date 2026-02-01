import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";

import {
  ClientInfo,
  EventData,
  TrackingPayload,
} from "../../types/tracking.js";
import {
  extractClickIds,
  extractUtmParams,
  parseUrlData,
  safeDecodeURIComponent,
  sanitizeUrlPath,
} from "../../utils/url-parser.js";
import { getGeolocation } from "../../utils/geo.js";
import { extractMetadata } from "./event.js";
import { extractHostname } from "../../utils/hostname.js";

export const processEvent = async (
  payload: TrackingPayload,
  clientInfo: ClientInfo,
  request: FastifyRequest,
): Promise<EventData> => {
  const eventId = randomUUID();
  const timestamp = payload.ts ? new Date(payload.ts * 1000) : new Date();

  // parse URL data
  const hostname = extractHostname(payload.url, request);
  const { urlPath, urlQuery, referrerPath, referrerQuery, referrerDomain } =
    parseUrlData(payload.url, payload.ref, hostname);

  // Extract UTM parameters
  const utmParams = extractUtmParams(payload.url, hostname);

  // Extract click IDs
  const clickIds = extractClickIds(payload.url, hostname);

  // Get geolocation (if enabled)
  const enableGeolocation = false;
  const geoData = enableGeolocation
    ? await getGeolocation(clientInfo.ip)
    : { country: "", subdivision1: "", subdivision2: "", city: "" };

  // Extract custom metadata
  const { metaKeys, metaValues } = extractMetadata(payload);

  const removeTrailingSlash = false;
  return {
    eventId,
    websiteId: payload.sid,
    sessionId: payload.ssid,
    userId: payload.vid,
    eventType: payload.t,
    eventName:
      payload.t === "event" ? payload.name || "custom_event" : "pageview",
    timestamp,
    urlPath: sanitizeUrlPath(
      safeDecodeURIComponent(urlPath),
      removeTrailingSlash || false,
    ),
    urlQuery: safeDecodeURIComponent(urlQuery),
    referrerPath: safeDecodeURIComponent(referrerPath),
    referrerQuery: safeDecodeURIComponent(referrerQuery),
    referrerDomain,
    pageTitle: payload.title || "",
    hostname: hostname || "",
    browser: clientInfo.browser,
    os: clientInfo.os,
    deviceType: clientInfo.deviceType,
    screen: payload.screen || "",
    language: payload.lang || "",
    country: geoData.country || "",
    subdivision1: geoData.subdivision1 || "",
    subdivision2: geoData.subdivision2 || "",
    city: geoData.city || "",
    utmSource: utmParams.utmSource,
    utmMedium: utmParams.utmMedium,
    utmCampaign: utmParams.utmCampaign,
    utmContent: utmParams.utmContent,
    utmTerm: utmParams.utmTerm,
    metaKeys,
    metaValues,
  };
};
