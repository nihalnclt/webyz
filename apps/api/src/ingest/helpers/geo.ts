import { NormalizedGeo } from "../types.js";

export const normalizeGeo = async (ip?: string): Promise<NormalizedGeo> => {
  return { country: "", subdivision1: "", subdivision2: "", city: "" };
};
