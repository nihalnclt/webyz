import fp from "fastify-plugin";
import { createClient } from "@clickhouse/client";

export default fp(async (fastify) => {
  const clickhouse = createClient({
    host: process.env.CLICKHOUSE_HOST,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: "webyz_analytics",
  });

  fastify.decorate("clickhouse", clickhouse);
});

declare module "fastify" {
  interface FastifyInstance {
    clickhouse: ReturnType<typeof createClient>;
  }
}
