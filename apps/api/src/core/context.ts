import { ClickHouseClient } from "@clickhouse/client";
import { PrismaClient } from "../generated/prisma/client.js";

export type AppContext = {
  clickhouse: ClickHouseClient;
  prisma: PrismaClient;
  // redis: Redis;
};
