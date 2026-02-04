export type BrowserStatsInput = {
  websiteId: string;
  from: number;
  to: number;
  limit: number;
  page: number;
  detailed: boolean;
};

export type BrowserStats = {
  name: string;
  visitors: number;
  visitDuration?: number;
  bounceRate?: number;
};

export type BrowserVersionStats = {
  browser: string;
  version: string;
  visitors: number;
  visitDuration?: number;
  bounceRate?: number;
};

export type OsStatsInput = {
  websiteId: string;
  from: number;
  to: number;
  limit: number;
  page: number;
  detailed: boolean;
};

export type OsVersionsStatsInput = {
  websiteId: string;
  from: number;
  to: number;
  os: string;
  limit: number;
  page: number;
  detailed: boolean;
};

export type DeviceTypeStatsInput = {
  websiteId: string;
  from: number;
  to: number;
  limit: number;
  page: number;
  detailed: boolean;
};

export type TopPagesStatsInput = {
  websiteId: string;
  from: number;
  to: number;
  limit: number;
  page: number;
  detailed: boolean;
};
