import { createHash, createHmac, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const COOKIE_NAME = "oracrest-admin-session";
const SESSION_SECONDS = 8 * 60 * 60;
const deriveKey = promisify(scrypt);

function getPasswordParts() {
  const [scheme, saltText, keyText, extra] = (
    process.env.ADMIN_PASSWORD_HASH || ""
  ).split("$");
  if (scheme !== "scrypt" || !saltText || !keyText || extra) return null;

  const salt = Buffer.from(saltText, "base64url");
  const key = Buffer.from(keyText, "base64url");
  if (salt.length < 16 || key.length !== 64) return null;
  return { salt, key };
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  if (Buffer.byteLength(secret) < 32) return null;
  return secret;
}

function safeEqual(left, right) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function isAdminAuthConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL?.trim() &&
    getPasswordParts() &&
    sessionSecret(),
  );
}

export async function verifyAdminCredentials(email, password) {
  const parts = getPasswordParts();
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!parts || !configuredEmail) return false;

  const candidate = await deriveKey(password, parts.salt, parts.key.length);
  const passwordMatches = timingSafeEqual(candidate, parts.key);
  return passwordMatches && safeEqual(email.trim().toLowerCase(), configuredEmail);
}

export function createAdminSession(email) {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");

  const payload = Buffer.from(
    JSON.stringify({
      sub: email.trim().toLowerCase(),
      exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readAdminSessionToken(token) {
  const secret = sessionSecret();
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!secret || !configuredEmail || typeof token !== "string") return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;
  const payloadText = token.slice(0, separator);
  const suppliedSignature = Buffer.from(token.slice(separator + 1), "base64url");
  const expectedSignature = createHmac("sha256", secret)
    .update(payloadText)
    .digest();
  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadText, "base64url").toString("utf8"));
    if (
      typeof payload.sub !== "string" ||
      !safeEqual(payload.sub, configuredEmail) ||
      !Number.isInteger(payload.exp) ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return { email: configuredEmail, expiresAt: payload.exp };
  } catch {
    return null;
  }
}

export async function getAdminSession(request) {
  const cookieStore = request
    ? request.cookies
    : await (await import("next/headers")).cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return readAdminSessionToken(token);
}

export function sessionCookie(token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`;
}

export function expiredSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim() ||
    request.headers.get("host");
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  if (!origin || !host) return false;

  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.host.toLowerCase() === host.toLowerCase() &&
      parsedOrigin.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

export function hashRequestIp(request) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Admin session signing is not configured.");
  const address =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  return createHmac("sha256", secret).update(address).digest("hex");
}
