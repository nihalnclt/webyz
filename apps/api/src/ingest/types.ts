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

export type ClientInfo = {
  ip: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  os: string;
};

export type NormalizedUserAgent = {
  browserFamily: string;
  browserVersion: string;
  osFamily: string;
  osVersion: string;
  deviceType: string;
  deviceBrand: string;
};

export type NormalizedGeo = {
  country: string;
  subdivision1: string;
  subdivision2: string;
  city: string;
};
