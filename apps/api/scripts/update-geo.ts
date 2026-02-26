import "dotenv/config";
import { updateGeoDB } from "../src/core/geo/geo-updater.service.js";

const run = async () => {
  try {
    console.log("🌍 Starting geo DB update...");
    await updateGeoDB();
    console.log("✅ Geo DB update finished");
    process.exit(0);
  } catch (err) {
    console.error("❌ Geo DB update failed:", err);
    process.exit(1);
  }
};

run();


// crontab -e
// 0 3 1 * * cd /your/project/path && node scripts/update-geo.ts >> geo.log 2>&1

// pm2 start scripts/update-geo.ts --name geo-cron --cron "0 3 1 * *"
// pm2 logs geo-cron