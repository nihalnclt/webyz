import fp from "fastify-plugin";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../generated/prisma/client.js";
import { DATABASE_URL } from "../../config/env.js";

const adapter = new PrismaPg({
  connectionString: DATABASE_URL!,
});

export default fp(async (fastify) => {
  const prisma = new PrismaClient({ adapter });
  await prisma.$connect();

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
