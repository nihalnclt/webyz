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
  device: string;
  browser: string;
  os: string;
  country?: string;
  region?: string;
  city?: string;
}
