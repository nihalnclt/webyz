import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = Number(process.env.PORT) || 3042;

export const DATABASE_URL = process.env.DATABASE_URL!;
export const CLICKHOUSE_HOST = process.env.CLICKHOUSE_HOST!;
export const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER || "default";
export const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD || "";

export const KAFKA_ENABLED = process.env.KAFKA_ENABLED === "true";
export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(",") || [];
export const KAFKA_TRACK_TOPIC = process.env.KAFKA_TOPIC || "tracking-events";

export const MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY!;

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3041";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
