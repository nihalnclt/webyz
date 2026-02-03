import path from "node:path";
import { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";
import fastifyAutoload from "@fastify/autoload";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";

import { registerErrorHandler } from "./plugins/error-handler.js";

export const options = {
  ajv: {
    customOptions: {
      coerceTypes: "array",
      removeAdditional: "all",
    },
  },
};

export default fp(async (fastify: FastifyInstance, opts) => {
  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), "/public"),
    prefix: "/",
  });

  fastify.register(cors, {
    origin: true,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["content-type"],
    maxAge: 86400,
  });

  await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "plugins/external"),
    options: { ...opts },
  });

  registerErrorHandler(fastify);

  // fastify.register(fastifyAutoload, {
  //   dir: path.join(import.meta.dirname, 'plugins/app'),
  //   options: { ...opts }
  // })

  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "routes"),
    autoHooks: true,
    cascadeHooks: true,
    options: { prefix: "/api", ...opts },
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit(),
    },
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        "Resource not found",
      );

      reply.code(404);

      return { message: "Not Found" };
    },
  );
});
