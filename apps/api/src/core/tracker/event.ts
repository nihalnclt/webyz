import { TrackingPayload } from "../../types/tracking.js";

export const extractMetadata = (
  payload: TrackingPayload,
): { metaKeys: string[]; metaValues: string[] } => {
  const metaKeys: string[] = [];
  const metaValues: string[] = [];

  // Standard fields to exclude from metadata
  const excludeFields = new Set([
    "t",
    "sid",
    "vid",
    "ssid",
    "pid",
    "url",
    "path",
    "ref",
    "title",
    "lang",
    "screen",
    "name",
    "new_visitor",
    "new_session",
    "ts",
  ]);

  Object.entries(payload).forEach(([key, value]) => {
    if (
      !excludeFields.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      metaKeys.push(key);
      metaValues.push(String(value));
    }
  });

  return { metaKeys, metaValues };
};
