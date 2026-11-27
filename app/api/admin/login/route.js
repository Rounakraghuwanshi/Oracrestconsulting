import { getPool } from "../../../../lib/db.js";
import {
  createAdminSession,
  hashRequestIp,
  isAdminAuthConfigured,
  isSameOrigin,
  sessionCookie,
  verifyAdminCredentials,
} from "../../../../lib/admin-auth.js";

export const runtime = "nodejs";

const jsonError = (error, status, headers = {}) =>
  Response.json({ error }, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("The sign-in request origin could not be verified.", 403);
  }
  if (Number(request.headers.get("content-length") || 0) > 4096) {
    return jsonError("The sign-in request is too large.", 413);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Submit sign-in details as JSON.", 415);
  }
  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return jsonError("The sign-in request is invalid.", 400);
  }
  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) {
    return jsonError("The sign-in request is invalid.", 400);
  }

  const email = typeof credentials.email === "string" ? credentials.email.trim() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  if (!email || email.length > 254 || !password || password.length > 256) {
    return jsonError("Enter your admin email and password.", 400);
  }
  if (!isAdminAuthConfigured()) {
    console.error("Admin sign-in is unavailable because its environment configuration is incomplete.");
    return jsonError("Admin sign-in is not configured.", 503);
  }

  try {
    const pool = getPool();
    const ipHash = hashRequestIp(request);
    const attempts = await pool.query(
      `SELECT COUNT(*)::int AS count, MIN(attempted_at) AS first_attempt
       FROM admin_login_attempts
       WHERE ip_hash = $1 AND attempted_at > NOW() - INTERVAL '15 minutes'`,
      [ipHash],
    );
    if (attempts.rows[0].count >= 10) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(attempts.rows[0].first_attempt).getTime()) / 1000,
      );
      const retryAfter = Math.max(1, 900 - elapsedSeconds);
      return jsonError(
        "Too many sign-in attempts. Try again later.",
        429,
        { "Retry-After": String(retryAfter) },
      );
    }

    const valid = await verifyAdminCredentials(email, password);
    if (!valid) {
      await pool.query(
        "INSERT INTO admin_login_attempts (ip_hash) VALUES ($1)",
        [ipHash],
      );
      await pool.query(
        "DELETE FROM admin_login_attempts WHERE attempted_at < NOW() - INTERVAL '1 day'",
      );
      return jsonError("Email or password is incorrect.", 401);
    }

    await pool.query("DELETE FROM admin_login_attempts WHERE ip_hash = $1", [ipHash]);
    const session = createAdminSession(process.env.ADMIN_EMAIL);
    return Response.json(
      { ok: true },
      {
        headers: {
          "Cache-Control": "no-store",
          "Set-Cookie": sessionCookie(session),
        },
      },
    );
  } catch (error) {
    console.error("Admin sign-in request failed.", error);
    return jsonError("Admin sign-in is temporarily unavailable.", 503);
  }
}
