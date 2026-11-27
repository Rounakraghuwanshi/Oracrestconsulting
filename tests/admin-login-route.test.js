import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/admin/login/route.js";

test("admin login rejects JSON that is not a credentials object", async () => {
  const request = new Request("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
      Host: "localhost:3000",
    },
    body: "null",
  });

  const response = await POST(request);
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
