import { reportUsageToStripe } from "../core/billing/billing-cron.service.js";

export async function reportStripeJob() {
  console.log("[cron] report stripe job");
  await reportUsageToStripe();
}