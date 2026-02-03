import { FastifyError, FastifyInstance } from "fastify";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler(async (error, request, reply) => {
    const isProd = process.env.NODE_ENV === "production";

    // App errors (expected)
    if ((error as any)?.isOperational) {
      return reply.status((error as any)?.statusCode).send({
        success: false,
        error: {
          code: (error as any).code,
          message: (error as any)?.message,
          details: isProd ? undefined : (error as any).details,
        },
      });
    }

    // Fastify validation errors
    if ((error as FastifyError).validation) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: isProd ? undefined : (error as FastifyError).validation,
        },
      });
    }

    // console.error("error", error?.message);
    // Unknown errors
    request.log.error(error, "Unhandled error");

    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  });
}
