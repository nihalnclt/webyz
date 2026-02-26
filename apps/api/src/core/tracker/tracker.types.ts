export type EventInput = {
  websiteId: string;
  sessionId: string;
  userId: string;
  eventType: "pageview" | "event";
  eventName: string;
  timestamp: Date;
  hostname: string;
  url: {
    path: string;
    query: string;
    referrerPath: string;
    referrerQuery: string;
    referrerDomain: string;
  };
  page: {
    title: string;
    screen: string;
    language: string;
  };
  client: {
    ip: string;
    deviceType: string;
  };
  userAgent: {
    browser: string;
    os: string;
  };
  geo: {
    country: string;
    subdivision1: string;
    subdivision2: string;
    city: string;
  };
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  meta: {
    keys: string[];
    values: string[];
  };
};

export type SessionUAInfo = {
  browserFamily: string;
  browserVersion: string;
  osFamily: string;
  osVersion: string;
  deviceType: string;
  deviceBrand: string;
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
