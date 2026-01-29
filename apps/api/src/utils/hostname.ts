import { FastifyRequest } from "fastify";

export const extractHostname = (
  url: string | undefined,
  request: FastifyRequest,
): string => {
  if (url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch {
      // If URL parsing fails, try to get from request
    }
  }

  return (request.headers["host"] || request.hostname || "unknown").split(
    ":",
  )[0];
};
