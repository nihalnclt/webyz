import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

import { AppContext } from "../../core/context.js";

export default fp(async (app: FastifyInstance) => {
  app.decorateRequest("ctx", null as any);

  app.addHook("onRequest", async (request) => {
    request.ctx = {
      clickhouse: app.clickhouse,
      prisma: app.prisma,
      redis: app.redis,
    } satisfies AppContext;
  });
});

declare module "fastify" {
  interface FastifyRequest {
    ctx: AppContext;
  }
}
