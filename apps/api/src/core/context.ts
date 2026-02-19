import { ClickHouseClient } from "@clickhouse/client";
import { PrismaClient } from "../generated/prisma/client.js";
import type { Redis } from "ioredis";

export type AppContext = {
  clickhouse: ClickHouseClient;
  prisma: PrismaClient;
  redis: Redis;
};
