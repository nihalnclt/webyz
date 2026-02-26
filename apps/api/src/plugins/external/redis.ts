import fp from "fastify-plugin";
import type { Redis as RedisType } from "ioredis";
import type { FastifyInstance } from "fastify";

import { redis } from "../../lib/redis.js";

declare module "fastify" {
  interface FastifyInstance {
    redis: RedisType;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate("redis", redis);
  fastify.addHook("onClose", async () => {
    await redis.quit();
  });
});
