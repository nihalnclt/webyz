import { createClient } from "@clickhouse/client";
import { PrismaClient } from "@prisma/client/extension";
import { Kafka } from "kafkajs";

import { track } from "../core/tracker/track.js";
import { KAFKA_BROKERS, KAFKA_TRACK_TOPIC } from "../config/env.js";

export const startTrackingWorker = async () => {
  const kafka = new Kafka({
    clientId: "webyz-tracking-worker",
    brokers: KAFKA_BROKERS,
  });

  const consumer = kafka.consumer({ groupId: "tracking-workers" });

  const prisma = new PrismaClient();
  const clickhouse = createClient({ host: process.env.CLICKHOUSE_HOST! });

  let shuttingDown = false;

  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log("[tracking-worker] shutting down");

    await consumer.disconnect().catch(() => {});
    await prisma.$disconnect().catch(() => {});
    await clickhouse.close().catch(() => {});

    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await prisma.$connect();
  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_TRACK_TOPIC,
    fromBeginning: false,
  });

  console.log("[tracking-worker] started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const data = JSON.parse(message.value.toString());

      const fakeRequest = {
        headers: data.headers || {},
        server: { prisma, clickhouse },
        ip:
          data.headers?.["x-forwarded-for"]?.split(",")[0] ||
          data.headers?.["x-real-ip"] ||
          "0.0.0.0",
      } as any;

      await track(data.payload, fakeRequest);
    },
  });
};
