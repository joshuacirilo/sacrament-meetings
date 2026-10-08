import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { z } from "zod";

// Hide password keystrokes and keep credentials out of shell history.
let hidden = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!hidden) process.stdout.write(chunk, encoding);
    callback();
  },
});
const prompt = createInterface({ input: process.stdin, output, terminal: true });
try {
  const email = (await prompt.question("Leader email: ")).trim().toLowerCase();
  if (!z.email().safeParse(email).success) throw new Error("Enter a valid email.");
  process.stdout.write("Leader password (hidden): ");
  hidden = true;
  const password = await prompt.question("");
  hidden = false;
  process.stdout.write("\n");
  if (password.length < 1 || password.length > 256) {
    throw new Error("Use between 1 and 256 characters.");
  }
  let contents = await readFile(".env.local", "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  contents = contents.replace(/^AUTH_LEADER_PASSWORD_HASH=.*\r?\n?/gm, "");
  if (/["\\\r\n]/.test(password)) throw new Error("Do not use double quotes, backslashes, or line breaks in the password.");
  const entries = {
    AUTH_LEADER_EMAIL: email,
    AUTH_LEADER_PASSWORD: password,
  };
  if (!/^AUTH_SECRET=.+$/m.test(contents)) entries.AUTH_SECRET = randomBytes(32).toString("base64");
  for (const [key, value] of Object.entries(entries)) {
    // Next.js expands dollar signs even in quoted dotenv values.
    const line = `${key}="${value.replaceAll("$", "\\$")}"`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    contents = pattern.test(contents)
      ? contents.replace(pattern, () => line)
      : `${contents.trimEnd()}\n${line}\n`;
  }
  await writeFile(".env.local", contents, { mode: 0o600 });
  console.log("Leader account configured in .env.local. Restart the development server.");
} catch (error) {
  hidden = false;
  console.error(error.message);
  process.exitCode = 1;
} finally {
  prompt.close();
}
