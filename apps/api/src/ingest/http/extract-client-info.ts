import { FastifyRequest } from "fastify";
import { UAParser } from "ua-parser-js";

import { getClientIP } from "../../utils/ip.js";
import { ClientInfo } from "../types.js";

export const extractClientInfoFromRequest = (
  request: FastifyRequest,
): ClientInfo => {
  const ip = getClientIP(request);
  const userAgent = request.headers["user-agent"] || "";

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    ip,
    userAgent,
    deviceType: device.type || "desktop",
    browser: `${browser.name || "unknown"} ${browser.version || ""}`.trim(),
    os: `${os.name || "unknown"} ${os.version || ""}`.trim(),
  };
};
