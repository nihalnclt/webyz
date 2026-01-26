import { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.get("/", {}, async function () {
    return { message: "Welcome to the official fastify demo!" };
  });
};

export default plugin;
