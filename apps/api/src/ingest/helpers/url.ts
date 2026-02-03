import {
  parseUrlData,
  safeDecodeURIComponent,
  sanitizeUrlPath,
} from "../../utils/url-parser.js";

export const normalizeUrlData = (
  url?: string,
  ref?: string,
  hostname?: string,
) => {
  const { urlPath, urlQuery, referrerPath, referrerQuery, referrerDomain } =
    parseUrlData(url, ref, hostname);

  return {
    path: sanitizeUrlPath(safeDecodeURIComponent(urlPath), false),
    query: safeDecodeURIComponent(urlQuery),
    referrerPath: safeDecodeURIComponent(referrerPath),
    referrerQuery: safeDecodeURIComponent(referrerQuery),
    referrerDomain,
  };
};
