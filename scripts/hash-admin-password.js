import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const terminal = createInterface({ input: stdin, output: stdout });
const password = await terminal.question("Choose the admin password: ");
terminal.close();

if (password.length < 14 || password.length > 256) {
  console.error("Use a password between 14 and 256 characters.");
  process.exitCode = 1;
} else {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, 64);
  console.log(`ADMIN_PASSWORD_HASH=scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`);
}
