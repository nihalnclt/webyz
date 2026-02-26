-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'INCOMPLETE', 'UNPAID');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "avatar_url" TEXT,
    "google_id" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'email',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "stripe_customer_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "user_id" TEXT NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "blocked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthly_price" INTEGER NOT NULL,
    "yearly_price" INTEGER NOT NULL,
    "event_limit" INTEGER NOT NULL,
    "extra_price_per_100k" INTEGER,
    "data_retention_days" INTEGER NOT NULL DEFAULT 180,
    "website_limit" INTEGER NOT NULL DEFAULT 1,
    "stripe_price_monthly_id" TEXT,
    "stripe_price_yearly_id" TEXT,
    "stripe_metered_price_id" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripe_subscription_id" TEXT,
    "stripe_recurring_item_id" TEXT,
    "stripe_metered_item_id" TEXT,
    "billing_cycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "current_period_start" TIMESTAMPTZ(6),
    "current_period_end" TIMESTAMPTZ(6),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "trial_ends_at" TIMESTAMPTZ(6),
    "canceled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_period_usages" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "period_start" TIMESTAMPTZ(6) NOT NULL,
    "period_end" TIMESTAMPTZ(6) NOT NULL,
    "total_events" BIGINT NOT NULL DEFAULT 0,
    "last_warned_threshold" DOUBLE PRECISION,
    "overage_reported_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "billing_period_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_records" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "billing_period_usage_id" TEXT NOT NULL,
    "overage_events" BIGINT NOT NULL,
    "stripe_quantity" INTEGER NOT NULL,
    "stripe_usage_record_id" TEXT,
    "reported_to_stripe" BOOLEAN NOT NULL DEFAULT false,
    "reported_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "websites_domain_key" ON "websites"("domain");

-- CreateIndex
CREATE INDEX "websites_user_id_idx" ON "websites"("user_id");

-- CreateIndex
CREATE INDEX "websites_is_blocked_idx" ON "websites"("is_blocked");

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripe_price_monthly_id_key" ON "plans"("stripe_price_monthly_id");

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripe_price_yearly_id_key" ON "plans"("stripe_price_yearly_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions"("current_period_end");

-- CreateIndex
CREATE INDEX "subscriptions_stripe_subscription_id_idx" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "billing_period_usages_subscription_id_idx" ON "billing_period_usages"("subscription_id");

-- CreateIndex
CREATE INDEX "billing_period_usages_overage_reported_at_idx" ON "billing_period_usages"("overage_reported_at");

-- CreateIndex
CREATE UNIQUE INDEX "billing_period_usages_subscription_id_period_start_key" ON "billing_period_usages"("subscription_id", "period_start");

-- CreateIndex
CREATE INDEX "usage_records_subscription_id_reported_to_stripe_idx" ON "usage_records"("subscription_id", "reported_to_stripe");

-- CreateIndex
CREATE INDEX "usage_records_reported_to_stripe_idx" ON "usage_records"("reported_to_stripe");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_period_usages" ADD CONSTRAINT "billing_period_usages_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_billing_period_usage_id_fkey" FOREIGN KEY ("billing_period_usage_id") REFERENCES "billing_period_usages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
