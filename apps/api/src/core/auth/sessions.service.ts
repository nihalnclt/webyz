import type { Redis } from "ioredis";
import { AppContext } from "../context.js";
import {
  SESSION_ROLL_THRESHOLD_DAYS,
  SESSION_TTL_MS,
} from "../../config/constants.js";

interface CachedSession {
  userId: string;
  email: string;
  name: string;
  sessionId: string;
  expiresAt: number; // epoch ms
}

// Redis TTL for session cache entries (seconds).
// Keep shorter than actual session TTL so we re-validate from DB occasionally.
const CACHE_TTL = 60 * 5; // 5 minutes
const SESSION_CACHE_PREFIX = "session:";

function cacheKey(sessionId: string) {
  return `${SESSION_CACHE_PREFIX}${sessionId}`;
}

async function getCachedSession(
  redis: Redis,
  sessionId: string,
): Promise<CachedSession | null> {
  const raw = await redis.get(cacheKey(sessionId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedSession;
  } catch {
    return null;
  }
}

async function setCachedSession(
  redis: Redis,
  session: CachedSession,
): Promise<void> {
  await redis.setex(
    cacheKey(session.sessionId),
    CACHE_TTL,
    JSON.stringify(session),
  );
}

async function invalidateCachedSession(
  redis: Redis,
  sessionId: string,
): Promise<void> {
  await redis.del(cacheKey(sessionId));
}

async function invalidateAllUserSessions(
  redis: Redis,
  userId: string,
  sessionIds: string[],
): Promise<void> {
  if (!sessionIds.length) return;
  await redis.del(...sessionIds.map(cacheKey));
}

export async function createSession(
  { prisma }: AppContext,
  userId: string,
  meta: { userAgent?: string; ipAddress?: string },
) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
    },
  });

  return session;
}

/**
 * Validate a session.
 *
 * Strategy:
 * 1. Check Redis cache first (fast path — no DB hit)
 * 2. On cache miss, hit Postgres (slow path — also rolls expiry + re-caches)
 * 3. On cache hit, still check if expiry is near and roll in DB if needed
 */
export async function validateSession(
  { prisma, redis }: AppContext,
  sessionId: string,
) {
  // ── Fast path: Redis cache ──────────────────────────────────────────────────
  const cached = await getCachedSession(redis, sessionId);

  if (cached) {
    // Expired in our cache record?
    if (cached.expiresAt < Date.now()) {
      await invalidateCachedSession(redis, sessionId);
      return null;
    }

    // Roll session in DB if expiry is near (async, don't await — non-blocking)
    const daysRemaining =
      (cached.expiresAt - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysRemaining < SESSION_ROLL_THRESHOLD_DAYS) {
      const newExpiry = new Date(Date.now() + SESSION_TTL_MS);
      prisma.session
        .update({ where: { id: sessionId }, data: { expiresAt: newExpiry } })
        .then(() => {
          // Update cache with new expiry
          setCachedSession(redis, {
            ...cached,
            expiresAt: newExpiry.getTime(),
          });
        })
        .catch(() => {}); // non-critical
    }

    return {
      userId: cached.userId,
      email: cached.email,
      name: cached.name,
      sessionId: cached.sessionId,
    };
  }

  // ── Slow path: Postgres ────────────────────────────────────────────────────
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  if (!session) return null;

  // Expired — clean up and reject
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    return null;
  }

  // Roll expiry if close
  let expiresAt = session.expiresAt;
  const daysRemaining =
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysRemaining < SESSION_ROLL_THRESHOLD_DAYS) {
    expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await prisma.session
      .update({ where: { id: sessionId }, data: { expiresAt } })
      .catch(() => {});
  }

  const result: CachedSession = {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    sessionId: session.id,
    expiresAt: expiresAt.getTime(),
  };

  // Populate cache for future requests
  await setCachedSession(redis, result);

  return {
    userId: result.userId,
    email: result.email,
    name: result.name,
    sessionId: result.sessionId,
  };
}

// ─── Revoke ───────────────────────────────────────────────────────────────────

/** Revoke a single session (logout current device). */
export async function revokeSession(
  { prisma, redis }: AppContext,
  sessionId: string,
): Promise<void> {
  await Promise.all([
    prisma.session.delete({ where: { id: sessionId } }).catch(() => {}),
    invalidateCachedSession(redis, sessionId),
  ]);
}

/** Revoke all sessions for a user (logout all devices). */
export async function revokeAllSessions(
  { prisma, redis }: AppContext,
  userId: string,
): Promise<void> {
  // Get all session IDs first so we can invalidate cache
  const sessions = await prisma.session.findMany({
    where: { userId },
    select: { id: true },
  });

  await Promise.all([
    prisma.session.deleteMany({ where: { userId } }),
    invalidateAllUserSessions(
      redis,
      userId,
      sessions.map((s) => s.id),
    ),
  ]);
}

/** Revoke all sessions except the current one. */
export async function revokeOtherSessions(
  { prisma, redis }: AppContext,
  userId: string,
  currentSessionId: string,
): Promise<{ count: number }> {
  const others = await prisma.session.findMany({
    where: { userId, id: { not: currentSessionId } },
    select: { id: true },
  });

  const [result] = await Promise.all([
    prisma.session.deleteMany({
      where: { userId, id: { not: currentSessionId } },
    }),
    invalidateAllUserSessions(
      redis,
      userId,
      others.map((s) => s.id),
    ),
  ]);

  return { count: result.count };
}

// ─── List ─────────────────────────────────────────────────────────────────────

export async function listSessions({ prisma }: AppContext, userId: string) {
  return prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export async function cleanupExpiredSessions({
  prisma,
}: AppContext): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
