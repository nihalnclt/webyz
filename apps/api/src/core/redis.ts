import RedisImport from "ioredis";

const Redis = (RedisImport as any).default || RedisImport;

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err: any) => {
  console.error("Redis error:", err);
});
