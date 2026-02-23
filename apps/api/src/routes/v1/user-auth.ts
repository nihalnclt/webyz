import type { FastifyInstance } from "fastify";
import {
  changePassBodySchema,
  loginUserBodySchema,
  logoutQuerySchema,
  registerUserBodySchema,
} from "../../schemas/user-auth.schema.js";
import {
  changePasswordController,
  googleAuthController,
  googleCallbackController,
  listSessionsController,
  loginController,
  logoutController,
  meController,
  registerController,
  revokeOtherSessionsController,
  revokeSessionController,
} from "../../controllers/user-auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    { schema: { body: registerUserBodySchema } },
    registerController,
  );
  fastify.post(
    "/login",
    { schema: { body: loginUserBodySchema } },
    loginController,
  );

  fastify.get("/google", googleAuthController);
  fastify.get("/google/callback", googleCallbackController);

  fastify.get("/me", { preHandler: [authenticate] }, meController);
  fastify.post(
    "/logout",
    { preHandler: [authenticate], schema: { querystring: logoutQuerySchema } },
    logoutController,
  );

  fastify.get(
    "/sessions",
    { preHandler: [authenticate] },
    listSessionsController,
  );
  fastify.delete(
    "/sessions",
    { preHandler: [authenticate] },
    revokeOtherSessionsController,
  );
  fastify.delete<{ Params: { sessionId: string } }>(
    "/sessions/:sessionId",
    { preHandler: [authenticate] },
    revokeSessionController,
  );

  fastify.post(
    "/password",
    {
      preHandler: [authenticate as any],
      schema: { body: changePassBodySchema },
    },
    changePasswordController,
  );
}
