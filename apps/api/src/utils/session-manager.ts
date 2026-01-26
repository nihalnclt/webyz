import { createHash } from "crypto";
import { startOfHour, startOfMonth } from "date-fns";

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createHash256 = (data: string): string => {
  return createHash("sha256").update(data).digest("hex");
};

export const createHashMD5 = (data: string): string => {
  return createHash("md5").update(data).digest("hex");
};

export const generateSessionId = (
  websiteId: string,
  ip: string,
  userAgent: string,
  salt: string
): string => {
  const data = `${websiteId}${ip}${userAgent}${salt}`;
  return createHash256(data);
};

export const generateVisitId = (
  sessionId: string,
  visitSalt: string
): string => {
  const data = `${sessionId}${visitSalt}`;
  return createHash256(data);
};

export const generateSalts = (timestamp: Date) => {
  return {
    sessionSalt: createHashMD5(startOfMonth(timestamp).toISOString()),
    visitSalt: createHashMD5(startOfHour(timestamp).toISOString()),
  };
};

export const isSessionExpired = (
  lastActivity: number,
  timeout: number
): boolean => {
  return Date.now() - lastActivity > timeout;
};
