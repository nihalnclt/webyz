import path from "node:path";
import { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";
import fastifyAutoload from "@fastify/autoload";

export const options = {
  ajv: {
    customOptions: {
      coerceTypes: "array",
      removeAdditional: "all",
    },
  },
};

export default fp(async (fastify: FastifyInstance, opts) => {
  await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "plugins/external"),
    options: { ...opts },
  });

  // fastify.register(fastifyAutoload, {
  //   dir: path.join(import.meta.dirname, 'plugins/app'),
  //   options: { ...opts }
  // })

  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, 'routes'),
    autoHooks: true,
    cascadeHooks: true,
    options: { ...opts }
  })

  console.log("CLICKHOUSE_HOST", process.env.CLICKHOUSE_HOST);


  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      "Unhandled error occurred"
    );

    reply.code(err.statusCode ?? 500);

    let message = "Internal Server Error";
    if (err.statusCode && err.statusCode < 500) {
      message = err.message;
    }

    return { message };
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
        "Resource not found"
      );

      reply.code(404);

      return { message: "Not Found" };
    }
  );
});
