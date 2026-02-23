import crypto from "crypto";
import type { FastifyRequest, FastifyReply } from "fastify";
import {
  changePassword,
  getUserById,
  loginUser,
  registerUser,
  upsertGoogleUser,
} from "../core/auth/users.js";
import {
  ChangePasswordInput,
  LoginUserInput,
  RegisterUserInput,
} from "../core/auth/types.js";
import {
  getRequestMeta,
  getSessionCookieOptions,
} from "../core/auth/cookies.js";
import {
  createSession,
  listSessions,
  revokeAllSessions,
  revokeOtherSessions,
  revokeSession,
} from "../core/auth/sessions.js";
import { SESSION_COOKIE_NAME } from "../config/constants.js";
import {
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  getGoogleUserInfo,
  storeOAuthState,
  validateAndConsumeOAuthState,
} from "../core/auth/google.js";
import { FRONTEND_URL } from "../config/env.js";

export async function registerController(
  request: FastifyRequest<{ Body: RegisterUserInput }>,
  reply: FastifyReply,
) {
  const user = await registerUser(request.ctx, request.body);
  const session = await createSession(
    request.ctx,
    user.id,
    getRequestMeta(request),
  );

  return reply
    .setCookie(SESSION_COOKIE_NAME, session.id, getSessionCookieOptions())
    .status(201)
    .send({ user });
}

export async function loginController(
  request: FastifyRequest<{ Body: LoginUserInput }>,
  reply: FastifyReply,
) {
  const user = await loginUser(request.ctx, request.body);
  const session = await createSession(
    request.ctx,
    user.id,
    getRequestMeta(request),
  );

  return reply
    .setCookie(SESSION_COOKIE_NAME, session.id, getSessionCookieOptions())
    .send({ user });
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId, sessionId } = request.session;
  const logoutAll =
    (request.query as { all?: string } | undefined)?.all === "true";

  if (logoutAll) {
    await revokeAllSessions(request.ctx, userId);
  } else {
    await revokeSession(request.ctx, sessionId);
  }

  return reply.clearCookie(SESSION_COOKIE_NAME, { path: "/" }).send({
    message: logoutAll ? "Logged out from all devices" : "Logged out",
  });
}

export async function meController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = await getUserById(request.ctx, request.session.userId);
  return reply.send({ user });
}

export async function listSessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessions = await listSessions(request.ctx, request.session.userId);

  const withCurrent = sessions.map((s) => ({
    ...s,
    isCurrent: s.id === request.session.sessionId,
  }));

  return reply.send({ sessions: withCurrent });
}

export async function revokeOtherSessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { count } = await revokeOtherSessions(
    request.ctx,
    request.session.userId,
    request.session.sessionId,
  );

  return reply.send({ message: `Revoked ${count} other session(s)` });
}

export async function revokeSessionController(
  request: FastifyRequest<{ Params: { sessionId: string } }>,
  reply: FastifyReply,
) {
  const sessions = await listSessions(request.ctx, request.session.userId);
  const owns = sessions.some((s) => s.id === request.params.sessionId);

  if (!owns) {
    return reply.status(403).send({ error: "Forbidden" });
  }

  await revokeSession(request.ctx, request.params.sessionId);
  return reply.send({ message: "Session revoked" });
}

export async function changePasswordController(
  request: FastifyRequest<{ Body: ChangePasswordInput }>,
  reply: FastifyReply,
) {
  const { userId, sessionId } = request.session;

  await changePassword(request.ctx, userId, request.body);

  await revokeOtherSessions(request.ctx, userId, sessionId);

  return reply.send({
    message: "Password updated. Other devices have been logged out.",
  });
}

export async function googleAuthController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const state = crypto.randomBytes(32).toString("hex");
  await storeOAuthState(request.ctx, state);
  return reply.redirect(buildGoogleAuthUrl(state));
}

export async function googleCallbackController(
  request: FastifyRequest<{
    Querystring: { code?: string; state?: string; error?: string };
  }>,
  reply: FastifyReply,
) {
  const { code, state, error } = request.query;

  if (error) {
    return reply.redirect(`${FRONTEND_URL}/auth/error?reason=${error}`);
  }

  if (!code || !state) {
    return reply.redirect(`${FRONTEND_URL}/auth/error?reason=missing_params`);
  }

  const stateValid = await validateAndConsumeOAuthState(request.ctx, state);
  if (!stateValid) {
    return reply.redirect(`${FRONTEND_URL}/auth/error?reason=invalid_state`);
  }

  const googleTokens = await exchangeCodeForTokens(code);
  const googleUser = await getGoogleUserInfo(googleTokens.access_token);
  const user = await upsertGoogleUser(request.ctx, googleUser);

  const session = await createSession(
    request.ctx,
    user.id,
    getRequestMeta(request),
  );

  return reply
    .setCookie(SESSION_COOKIE_NAME, session.id, getSessionCookieOptions())
    .redirect(`${FRONTEND_URL}/auth/success`);
}
