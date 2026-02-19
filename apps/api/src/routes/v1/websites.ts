import { FastifyInstance } from "fastify";

import { createWebsiteController } from "../../controllers/websites.controller.js";
import { createWebsiteBodySchema } from "../../schemas/website.schema.js";

export default async function websiteRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/websites",
    { schema: { body: createWebsiteBodySchema } },
    createWebsiteController,
  );
}
