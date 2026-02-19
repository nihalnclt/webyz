import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import closeWithGrace from "close-with-grace";

import serviceApp from "./app.js";
import { PORT } from "./config/env.js";

const app = Fastify({
  // logger: pino({ level: process.env.LOG_LEVEL }),
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    transport: {
      targets: [
        {
          target: "@fastify/one-line-logger",
          level: "info",
        },
        {
          target: "pino-pretty",
          level: "error",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      ],
    },
  },
  ajv: {
    customOptions: {
      coerceTypes: "array", // change type of data to match type keyword
      removeAdditional: "all", // Remove additional body properties
    },
  },
});

const startServer = async () => {
  app.register(serviceApp);

  // process.env.FASTIFY_CLOSE_GRACE_DELAY ?? 500
  closeWithGrace({ delay: 500 }, async ({ err }) => {
    if (err != null) {
      app.log.error(err);
    }

    await app.close();
  });

  await app.ready();

  try {
    await app.listen({ port: PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
