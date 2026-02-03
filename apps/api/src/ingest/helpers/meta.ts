import { TrackingPayload } from "../types.js";

export const normalizeMeta = (
  payload: TrackingPayload,
): { keys: string[]; values: string[] } => {
  const keys: string[] = [];
  const values: string[] = [];

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

  for (const [key, value] of Object.entries(payload)) {
    if (
      !excludeFields.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      keys.push(key);
      values.push(String(value));
    }
  }

  return { keys, values };
};
