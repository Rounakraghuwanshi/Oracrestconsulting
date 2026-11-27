import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { createAdminSession, readAdminSessionToken } from "../lib/admin-auth.js";

const originalEmail = process.env.ADMIN_EMAIL;
const originalSecret = process.env.ADMIN_SESSION_SECRET;

test("admin sessions require a valid signature, matching account, and unexpired token", () => {
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.ADMIN_SESSION_SECRET = "test-only-session-secret-that-is-at-least-32-bytes";

  try {
    const token = createAdminSession("ADMIN@example.com");
    assert.equal(readAdminSessionToken(token)?.email, "admin@example.com");
    const [payload, signature] = token.split(".");
    const changedPayload = `${payload[0] === "A" ? "B" : "A"}${payload.slice(1)}`;
    assert.equal(readAdminSessionToken(`${changedPayload}.${signature}`), null);

    const expiredPayload = Buffer.from(JSON.stringify({
      sub: "admin@example.com",
      exp: Math.floor(Date.now() / 1000) - 1,
    })).toString("base64url");
    const expiredSignature = createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
      .update(expiredPayload)
      .digest("base64url");
    assert.equal(readAdminSessionToken(`${expiredPayload}.${expiredSignature}`), null);
  } finally {
    if (originalEmail === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = originalEmail;
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSecret;
  }
});
