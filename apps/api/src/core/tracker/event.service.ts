import { randomUUID } from "crypto";
import { EventData, EventInput } from "./tracker.types.js";

export const mapEventInputToEventData = (input: EventInput): EventData => ({
  eventId: randomUUID(),
  websiteId: input.websiteId,
  sessionId: input.sessionId,
  userId: input.userId,
  eventType: input.eventType,
  eventName: input.eventName,
  timestamp: input.timestamp,

  urlPath: input.url.path,
  urlQuery: input.url.query,
  referrerPath: input.url.referrerPath,
  referrerQuery: input.url.referrerQuery,
  referrerDomain: input.url.referrerDomain,

  pageTitle: input.page.title,
  hostname: input.hostname,

  browser: input.userAgent.browser,
  os: input.userAgent.os,
  deviceType: input.client.deviceType,

  screen: input.page.screen,
  language: input.page.language,

  country: input.geo.country,
  subdivision1: input.geo.subdivision1,
  subdivision2: input.geo.subdivision2,
  city: input.geo.city,

  utmSource: input.utm.source,
  utmMedium: input.utm.medium,
  utmCampaign: input.utm.campaign,
  utmContent: input.utm.content,
  utmTerm: input.utm.term,

  metaKeys: input.meta.keys,
  metaValues: input.meta.values,
});
