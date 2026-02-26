import { syncUsageFromClickhouse } from "../core/billing/billing-cron.service.js";

export async function syncUsageJob() {
  console.log("[cron] sync usage job");
  await syncUsageFromClickhouse();
}
