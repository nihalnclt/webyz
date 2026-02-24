import type { FastifyInstance } from "fastify";
import {
  changePassBodySchema,
  loginUserBodySchema,
  logoutQuerySchema,
  signupUserBodySchema,
} from "../../schemas/user-auth.schema.js";
import {
  changePasswordController,
  googleAuthController,
  googleCallbackController,
  listSessionsController,
  loginController,
  logoutController,
  meController,
  revokeOtherSessionsController,
  revokeSessionController,
  signupController,
} from "../../controllers/user-auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/users/auth/signup",
    { schema: { body: signupUserBodySchema } },
    signupController,
  );
  fastify.post(
    "/users/auth/login",
    { schema: { body: loginUserBodySchema } },
    loginController,
  );

  fastify.get("/users/auth/google", googleAuthController);
  fastify.get("/users/auth/google/callback", googleCallbackController);

  fastify.get("/users/auth/me", { preHandler: [authenticate] }, meController);
  fastify.post(
    "/users/auth/logout",
    { preHandler: [authenticate], schema: { querystring: logoutQuerySchema } },
    logoutController,
  );

  fastify.get(
    "/users/auth/sessions",
    { preHandler: [authenticate] },
    listSessionsController,
  );
  fastify.delete(
    "/users/auth/sessions",
    { preHandler: [authenticate] },
    revokeOtherSessionsController,
  );
  fastify.delete<{ Params: { sessionId: string } }>(
    "/users/auth/sessions/:sessionId",
    { preHandler: [authenticate] },
    revokeSessionController,
  );

  fastify.post(
    "/users/auth/password",
    {
      preHandler: [authenticate as any],
      schema: { body: changePassBodySchema },
    },
    changePasswordController,
  );
}
