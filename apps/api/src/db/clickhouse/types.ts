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

export type BrowserStatsRow = {
  name: string;
  visitors: number;
  visit_duration?: number;
  bounce_rate?: number;
};

export type BrowserVersionStatsRow = {
  version: string;
  browser: string;
  visitors: number;
  visit_duration?: number;
  bounce_rate?: number;
};

export type OSStatsRow = {
  name: string;
  visitors: number;
  visit_duration?: number;
  bounce_rate?: number;
};

export type OSVersionsStatsRow = {
  version: string;
  os: string;
  visitors: number;
  visit_duration?: number;
  bounce_rate?: number;
};

export type DeviceTypeStatsRow = {
  name: string;
  visitors: number;
  visit_duration?: number;
  bounce_rate?: number;
};
