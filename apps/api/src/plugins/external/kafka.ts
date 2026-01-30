import fp from "fastify-plugin";
import { Kafka } from "kafkajs";
import { KAFKA_BROKERS } from "../../config/env.js";

const KAFKA_ENABLED = false;

export default fp(async (fastify) => {
  if (!KAFKA_ENABLED) return;

  const kafka = new Kafka({
    clientId: "webyz-api",
    brokers: KAFKA_BROKERS,
  });

  const producer = kafka.producer();
  await producer.connect();

  fastify.decorate("kafkaProducer", producer);

  fastify.addHook("onClose", async () => {
    await producer.disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    kafkaProducer?: any;
  }
}
