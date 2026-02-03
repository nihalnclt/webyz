import { FastifyReply } from "fastify";

type Meta = Record<string, unknown>;

export function sendResponse<T>(
  reply: FastifyReply,
  data: T,
  options?: { statusCode: number; meta?: Meta },
) {
  const statusCode = options?.statusCode ?? 200;

  reply.code(statusCode).type("application/json");

  return reply.send({
    success: true,
    data,
    meta: {
      requestId: reply.request.id,
      ...options?.meta,
    },
  });
}
