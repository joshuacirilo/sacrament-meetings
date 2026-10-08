import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import bcrypt from "bcryptjs";

// Pass an external playwright-core installation; no test account is persisted.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.AUTH_TEST_PLAYWRIGHT || "playwright-core");
const port = process.env.AUTH_TEST_PORT || "3102";
const baseURL = `http://localhost:${port}`;
const email = "auth-test@example.invalid";
const password = randomBytes(24).toString("base64url");
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", port], {
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: {
    ...process.env,
    AUTH_URL: baseURL,
    AUTH_SECRET: randomBytes(32).toString("base64"),
    AUTH_LEADER_EMAIL: email,
    AUTH_LEADER_PASSWORD_HASH: await bcrypt.hash(password, 12),
  },
});
let logs = "";
server.stdout.on("data", (data) => { logs += data; });
server.stderr.on("data", (data) => { logs += data; });
let browser;
let passed = 0;
function check(condition, label) {
  assert.ok(condition, label);
  console.log(`PASS ${++passed}: ${label}`);
}
try {
  for (let attempt = 0; attempt < 90; attempt++) {
    if (server.exitCode !== null) throw new Error("Test server exited before becoming ready.");
    try {
      if ((await fetch(`${baseURL}/login`)).ok) break;
    } catch {}
    await delay(1000);
  }
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  for (const path of ["/meetings/new", "/meetings/1/edit"]) {
    await page.goto(path);
    await page.getByRole("heading", { name: "Leader sign in" }).waitFor();
    check(new URL(page.url()).pathname === "/login", `Anonymous ${path} redirects to login`);
  }
  await page.goto("/meetings");
  await page.getByRole("heading", { name: "Sacrament meetings", exact: true }).waitFor();
  check(await page.getByRole("link", { name: "New meeting", exact: true }).count() === 0, "Public list hides create control");
  check(await page.getByRole("button", { name: /^Delete/ }).count() === 0, "Public list hides delete controls");
  const detailHref = await page.getByRole("link", { name: "View program", exact: true }).first().getAttribute("href");
  await page.goto(detailHref);
  check(new URL(page.url()).pathname === detailHref, "Program detail stays public");
  await page.goto("/login");
  await page.getByLabel("Email (required)").fill(email);
  await page.getByLabel("Password (required)").fill("incorrect-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByText("Invalid email or password.", { exact: true }).waitFor();
  check(new URL(page.url()).pathname === "/login", "Incorrect credentials rejected with feedback");
  await page.getByLabel("Email (required)").fill(email);
  await page.getByLabel("Password (required)").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/meetings");
  await page.getByRole("link", { name: "New meeting", exact: true }).waitFor();
  check(true, "Valid credentials open meetings with management controls");
  const session = await (await context.request.get("/api/auth/session")).json();
  check(session.user.email === email && !JSON.stringify(session).includes("password"), "Session exposes user but no password/hash");
  await page.goto("/login");
  await page.waitForURL("**/meetings");
  check(true, "Signed-in user is redirected away from login");

  // Intercept and abort real action requests before the server sees them.
  // Replay payloads without cookies against their original routes. The delete
  // action runs on the public list, where Proxy does not protect the request.
  const captures = [];
  async function captureAction(trigger) {
    const captured = new Promise((resolve) => {
      page.route("**/*", async (route) => {
        const request = route.request();
        if (request.method() === "POST" && request.headers()["next-action"]) {
          resolve({ url: request.url(), headers: request.headers(), body: request.postDataBuffer() });
          await route.abort();
        } else await route.continue();
      });
    });
    await trigger();
    captures.push(await Promise.race([captured, delay(15000).then(() => { throw new Error("Action capture timed out"); })]));
    await page.unroute("**/*");
  }
  await page.goto("/meetings/new");
  await page.getByRole("heading", { name: "Create meeting", exact: true }).waitFor();
  check(true, "Authenticated create route renders");
  await captureAction(() => page.locator("main form").evaluate((form) => form.requestSubmit()));
  await page.goto(`${detailHref}/edit`);
  await page.getByRole("heading", { name: "Edit meeting", exact: true }).waitFor();
  check(true, "Authenticated edit route renders");
  await captureAction(() => page.locator("main form").evaluate((form) => form.requestSubmit()));
  await page.goto("/meetings");
  page.once("dialog", (dialog) => dialog.accept());
  await captureAction(() => page.getByRole("button", { name: /^Delete/ }).first().click());
  const anonymous = await browser.newContext({ baseURL });
  for (const [index, action] of captures.entries()) {
    const result = await anonymous.request.post(action.url, {
      headers: {
        "next-action": action.headers["next-action"],
        "content-type": action.headers["content-type"],
        origin: baseURL,
      },
      data: action.body,
      maxRedirects: 0,
    });
    check(result.headers()["x-action-redirect"]?.startsWith("/login") || result.headers()["location"]?.includes("/login"), `Unauthenticated ${["create", "update", "delete"][index]} action redirects before mutation`);
  }
  await anonymous.close();
  await page.goto("/meetings");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.waitForURL("**/login");
  check(!(await (await context.request.get("/api/auth/session")).json())?.user, "Logout removes the authenticated session");
  await page.goto("/meetings/new");
  await page.waitForURL("**/login**");
  check(true, "Protected route requires login again after logout");
  await page.goto("/meetings");
  check(await page.getByRole("button", { name: /^Delete/ }).count() === 0, "Logout removes management controls from public list");
  console.log(`Authentication verification complete: ${passed} checks passed. No meeting mutations sent with a session.`);
} catch (error) {
  console.error(error);
  // Only show diagnostics; the random test credentials and cookies are never logged.
  console.error(logs.replaceAll(password, "[redacted]"));
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
}



