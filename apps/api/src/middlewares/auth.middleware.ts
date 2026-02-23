import type { FastifyRequest, FastifyReply } from "fastify";
import { SESSION_COOKIE_NAME } from "../config/constants.js";
import { validateSession } from "../core/auth/sessions.js";

declare module "fastify" {
  interface FastifyRequest {
    session: {
      userId: string;
      email: string;
      name: string;
      sessionId: string;
    };
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const sessionId = request.cookies[SESSION_COOKIE_NAME];

  if (!sessionId) {
    return reply.status(401).send({ error: "Authentication required" });
  }

  const session = await validateSession(request.ctx, sessionId);

  if (!session) {
    reply.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return reply
      .status(401)
      .send({ error: "Session expired. Please log in again." });
  }

  request.session = session;
}

export async function optionalAuthenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const sessionId = request.cookies[SESSION_COOKIE_NAME];
  if (!sessionId) return;

  const session = await validateSession(request.ctx, sessionId);
  if (session) request.session = session;
}
