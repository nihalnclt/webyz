import { FastifyRequest } from "fastify";
import { UAParser } from "ua-parser-js";

import { ClientInfo } from "../types/tracking.js";

export const getClientIP = (request: FastifyRequest): string => {
  const forwarded = request.headers["x-forwarded-for"];
  const realIp = request.headers["x-real-ip"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  if (typeof realIp === "string") {
    return realIp;
  }

  return request.ip || "127.0.0.1";
};

export const extractClientInfo = (request: FastifyRequest): ClientInfo => {
  const ip = getClientIP(request);
  const userAgent = request.headers["user-agent"] || "";
  const parser = new UAParser(userAgent);

  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    ip,
    userAgent,
    device: device.type || "desktop",
    browser: `${browser.name || "unknown"} ${browser.version || ""}`.trim(),
    os: `${os.name || "unknown"} ${os.version || ""}`.trim(),
  };
};
