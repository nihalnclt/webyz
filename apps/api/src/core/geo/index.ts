import { geoLookup } from "./geo-lookup.js";
import { NormalizedGeo } from "./types.js";

export const normalizeGeo = async (ip?: string): Promise<NormalizedGeo> => {
  return geoLookup(ip);
};

export * from "./geo-loader.js";
