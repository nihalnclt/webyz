import { enforceUsageLimits } from "../core/billing/billing-cron.service.js";

export async function enforceLimitsJob() {
  console.log("[cron] enforce limits job");
  await enforceUsageLimits();
}
