export interface TrackingPayload {
  t: "pageview" | "event";
  sid: string;
  vid: string;
  ssid: string;
  pid?: string;
  url?: string;
  path?: string;
  ref?: string;
  title?: string;
  lang?: string;
  screen?: string;
  ts: number;
  new_visitor?: 0 | 1 | "0" | "1";
  new_session?: 0 | 1 | "0" | "1";
  name?: string;
  [key: string]: any;
}

export interface ClientInfo {
  ip: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  os: string;
  country?: string;
  region?: string;
  city?: string;
}

export type SessionData = {
  sessionId: string;
  websiteId: string;
  userId: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  entryPage: string;
  exitPage: string;
  pageViews: number;
  events: number;
  hostname: string;
  browserFamily: string;
  browserVersion: string;
  osFamily: string;
  osVersion: string;
  deviceType: string;
  deviceBrand: string;
  country: string;
  city: string;
};

export type SessionRow = {
  session_id: string;
  website_id: string;
  user_id: string;
  start_time: number;
  end_time: number;
  duration_seconds: number;
  entry_page: string;
  exit_page: string;
  page_views: number;
  events: number;
  hostname: string;
  browser_family: string;
  browser_version: string;
  os_family: string;
  os_version: string;
  device_type: string;
  device_brand: string;
  country: string;
  city: string;
};

export type EventData = {
  eventId: string;
  websiteId: string;
  sessionId: string;
  userId: string;
  eventType: string;
  eventName: string;
  timestamp: Date;
  urlPath: string;
  urlQuery: string;
  referrerPath: string;
  referrerQuery: string;
  referrerDomain: string;
  pageTitle: string;
  hostname: string;
  browser: string;
  os: string;
  deviceType: string;
  screen: string;
  language: string;
  country: string;
  subdivision1: string;
  subdivision2: string;
  city: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  metaKeys: string[];
  metaValues: string[];
};

export type BrowserStatsRow = {
  name: string;
  visitors: number;
  visit_duration?: number;
  bounce_rate?: number;
}

