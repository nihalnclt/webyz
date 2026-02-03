import { FastifyRequest } from "fastify";

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
