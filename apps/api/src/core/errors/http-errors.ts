import { createAppError } from "./app-error.js";

export const badRequest = (message = "Bad request", details?: unknown) =>
  createAppError(message, {
    code: "BAD_REQUEST",
    statusCode: 400,
    details,
  });

export const unauthorized = (message = "Unauthorized") =>
  createAppError(message, {
    code: "UNAUTHORIZED",
    statusCode: 401,
  });

export const notFound = (message = "Not found") =>
  createAppError(message, {
    code: "NOT_FOUND",
    statusCode: 404,
  });
