import { geoLookup } from "./geo-lookup.service.js";
import { NormalizedGeo } from "./geo.types.js";

export const normalizeGeo = async (ip?: string): Promise<NormalizedGeo> => {
  return geoLookup(ip);
};

export * from "./geo-loader.service.js";
