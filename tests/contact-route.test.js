import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { POST } from "../app/api/contact/route.js";

const originalEnvironment = Object.fromEntries(
  ["RESEND_API_KEY", "EMAIL_FROM", "CONTACT_EMAIL", "ORACREST_EMAIL"].map(
    (key) => [key, process.env[key]],
  ),
);
const originalFetch = globalThis.fetch;

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  globalThis.fetch = originalFetch;
});

function formRequest(entries) {
  const form = new FormData();
  for (const [key, value] of entries) form.append(key, value);
  return new Request("http://localhost/api/contact", {
    method: "POST",
    body: form,
  });
}

test("rejects form submissions without a valid contact email", async () => {
  const response = await POST(
    formRequest([
      ["kind", "enquiry"],
      ["name", "Taylor"],
      ["email", "not-an-email"],
    ]),
  );
  assert.equal(response.status, 400);
});

test("reports missing email delivery configuration without claiming success", async () => {
  for (const key of ["RESEND_API_KEY", "EMAIL_FROM"]) {
    delete process.env[key];
  }

  const response = await POST(
    formRequest([
      ["kind", "enquiry"],
      ["name", "Taylor"],
      ["email", "taylor@example.com"],
    ]),
  );
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /temporarily unavailable/);
});

test("delivers a configured enquiry through the email provider", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.EMAIL_FROM = "ORACREST <forms@example.com>";
  process.env.CONTACT_EMAIL = "info@example.com";
  let emailPayload;
  globalThis.fetch = async (_url, options) => {
    emailPayload = JSON.parse(options.body);
    return Response.json({ id: "email-id" }, { status: 201 });
  };

  const response = await POST(
    formRequest([
      ["kind", "enquiry"],
      ["name", "Taylor"],
      ["email", "taylor@example.com"],
      ["message", "<script>alert(1)</script>"],
    ]),
  );

  assert.equal(response.status, 200);
  assert.equal(emailPayload.to[0], "info@example.com");
  assert.ok(!emailPayload.html.includes("<script>"));
  assert.match((await response.json()).message, /has been sent/);
});
