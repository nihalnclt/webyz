import maxmind, { Reader } from "maxmind";
import path from "path";

let reader: Reader<any> | null = null;

export const loadGeoDB = async () => {
  if (reader) return reader;

  try {
    const dbPath = path.join(process.cwd(), "geo/GeoLite2-City.mmdb");
    reader = await maxmind.open(dbPath);
    console.log("🌍 Geo DB loaded");
  } catch (err) {
    console.error("Geo DB load failed", err);
  }

  return reader;
};

export const getGeoReader = () => reader;
