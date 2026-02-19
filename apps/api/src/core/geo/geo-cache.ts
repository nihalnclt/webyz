import { LRUCache } from "lru-cache";

import { NormalizedGeo } from "./types.js";

export const geoCache = new LRUCache<string, NormalizedGeo>({
  max: 100_000, // store 100k IPs
  ttl: 1000 * 60 * 60 * 24, // 24h
});
