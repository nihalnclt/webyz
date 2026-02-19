import axios from "axios";
import fs from "fs-extra";
import path from "path";
import * as tar from "tar";
import { pipeline } from "stream/promises";

import { loadGeoDB } from "./geo-loader.js";
import { MAXMIND_LICENSE_KEY } from "../../config/env.js";

const GEO_URL = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz`;

export const updateGeoDB = async () => {
  try {
    if (!MAXMIND_LICENSE_KEY) {
      throw new Error("MAXMIND_LICENSE_KEY missing");
    }

    console.log("🌍 Updating Geo DB...");

    const geoDir = path.join(process.cwd(), "geo");
    const tarPath = path.join(geoDir, "geo.tar.gz");

    await fs.emptyDir(geoDir);
    await fs.ensureDir(geoDir);

    const res = await axios({
      url: GEO_URL,
      method: "GET",
      responseType: "stream",
      timeout: 1000 * 60 * 5,
    });

    await pipeline(res.data, fs.createWriteStream(tarPath));

    await tar.x({ file: tarPath, cwd: geoDir });

    const files = await fs.readdir(geoDir);
    const folder = files.find((f) => f.startsWith("GeoLite2-City"));

    if (!folder) {
      throw new Error("GeoLite folder not found after extract");
    }

    const mmdb = path.join(geoDir, folder, "GeoLite2-City.mmdb");
    const finalPath = path.join(geoDir, "GeoLite2-City.mmdb");
    const tmpPath = path.join(geoDir, "GeoLite2-City.tmp.mmdb");

    await fs.copy(mmdb, tmpPath);
    await fs.move(tmpPath, finalPath, { overwrite: true });

    console.log("✅ Geo DB updated");

    await loadGeoDB();
  } catch (err) {
    console.error("Geo update failed", err);
  }
};
