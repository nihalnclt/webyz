import fp from "fastify-plugin";
import { clickhouse } from "../../lib/clickhouse.js";
import { createClient } from "@clickhouse/client";

export default fp(async (fastify) => {
  fastify.decorate("clickhouse", clickhouse);
});

declare module "fastify" {
  interface FastifyInstance {
    clickhouse: ReturnType<typeof createClient>;
  }
}
