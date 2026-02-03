import { extractUtmParams } from "../../utils/url-parser.js";

export const normalizeUtm = (url?: string, hostname?: string) => {
  const utm = extractUtmParams(url, hostname);
  return {
    source: utm.utmSource,
    medium: utm.utmMedium,
    campaign: utm.utmCampaign,
    content: utm.utmContent,
    term: utm.utmTerm,
  };
};
