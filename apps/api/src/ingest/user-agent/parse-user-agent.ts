import { UAParser } from "ua-parser-js";
import { normalizeBrowser, normalizeOS } from "../../utils/ua-normalizer.js";
import { NormalizedUserAgent } from "../types.js";

export const parseUserAgent = (userAgent: string): NormalizedUserAgent => {
  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    browserFamily: normalizeBrowser(browser.name),
    browserVersion: browser.version || "Unknown",
    osFamily: normalizeOS(os.name),
    osVersion: os.version || "Unknown",
    deviceType: device.type || "Desktop",
    deviceBrand: device.vendor || "Unknown",
  };
};
