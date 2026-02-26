import fp from "fastify-plugin";

import { PrismaClient } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";

export default fp(async (fastify) => {
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
