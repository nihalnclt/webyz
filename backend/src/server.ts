import Fastify from "fastify";
import pino from "pino";
import closeWithGrace from "close-with-grace";

import serviceApp from "./app.js";

const app = Fastify({
  logger: pino({ level: process.env.LOG_LEVEL }),
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
    // process.env.PORT ?? 3000
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
