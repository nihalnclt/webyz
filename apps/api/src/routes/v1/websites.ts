import { FastifyInstance } from "fastify";

import {
  createWebsiteController,
  listWebsitesController,
} from "../../controllers/websites.controller.js";
import { createWebsiteBodySchema } from "../../schemas/website.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

export default async function websiteRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/websites",
    { preHandler: [authenticate], schema: { body: createWebsiteBodySchema } },
    createWebsiteController,
  );

  fastify.get(
    "/websites",
    { preHandler: [authenticate] },
    listWebsitesController,
  );
}
