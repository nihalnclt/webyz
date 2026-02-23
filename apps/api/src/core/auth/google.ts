import { AppContext } from "../context.js";
import { GoogleUserInfo } from "./types.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const OAUTH_STATE_TTL = 60 * 10; // 10 minutes

// ─── OAuth URL ────────────────────────────────────────────────────────────────

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
}

// ─── Code Exchange ────────────────────────────────────────────────────────────

export async function exchangeCodeForTokens(code: string) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${await res.text()}`);
  }

  return res.json() as Promise<{ access_token: string }>;
}

// ─── User Info ────────────────────────────────────────────────────────────────

export async function getGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserInfo> {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Failed to fetch Google user info");

  const data = await res.json();
  return data as GoogleUserInfo;
}

// ─── CSRF State via Redis ─────────────────────────────────────────────────────
// Pure ephemeral TTL data — Redis is the right tool here.
// Key: oauth:state:<state> → '1'

export async function storeOAuthState(
  { redis }: AppContext,
  state: string,
): Promise<void> {
  await redis.setex(`oauth:state:${state}`, OAUTH_STATE_TTL, "1");
}

/**
 * Validates and atomically consumes the state (DEL returns 1 if existed).
 * Using DEL as consume prevents any replay even under concurrent requests.
 */
export async function validateAndConsumeOAuthState(
  { redis }: AppContext,
  state: string,
): Promise<boolean> {
  const deleted = await redis.del(`oauth:state:${state}`);
  return deleted === 1;
}
