import { createAppError } from "./app-error.js";

export const invalidPeriod = (period: string) =>
  createAppError("Invalid analytics period", {
    code: "INVALID_PERIOD",
    statusCode: 400,
    details: { period },
  });

export const siteAccessDenied = () =>
  createAppError("You do not have access to this site", {
    code: "SITE_ACCESS_DENIED",
    statusCode: 403,
  });
