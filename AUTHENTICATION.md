# Authentication (Week 05)

This app uses Auth.js v5 Credentials with one authorized ward leader, following
[the class activity](https://byui-cse.github.io/wdd430-ww-course-v2/week05/prepare-authentication.html).
There is no public registration. All meeting programs remain publicly readable.

## Local setup

```powershell
pnpm install --frozen-lockfile
pnpm run auth:setup
pnpm run dev
```

In PowerShell environments that block `.ps1` wrappers, use `pnpm.cmd`.
The setup command prompts for your email and a hidden password (1 to 256 characters). It writes the email, the literal password, and an
AUTH_SECRET to the ignored `.env.local`; existing database variables are preserved.
It does not print credentials. Running it again replaces the configured account.
Restart the app after changing environment variables.

Open `/login` or use **Leader sign in** in the header. Successful login opens
`/meetings`, where **New meeting**, **Edit**, and **Delete** become available.
Use **Sign out** in the header to end the session and return to `/login`.

## Environment and deployment

Configure these server-only variables in each Vercel environment used for testing
or deployment, then redeploy:

| Variable | Value |
| --- | --- |
| `AUTH_SECRET` | Random secret of at least 32 bytes; use a different secret per environment. |
| `AUTH_LEADER_EMAIL` | Authorized leader's email. |
| `AUTH_LEADER_PASSWORD` | The literal login password. |

Never use a `NEXT_PUBLIC_` prefix or commit `.env.local`. Passwords are stored
as literal server-only environment variables at the user's request. In Vercel,
enter the password directly, without surrounding quotes. Remove the obsolete
`AUTH_LEADER_PASSWORD_HASH` variable. Keep `AUTH_SECRET`: Auth.js needs it for
sessions, independently of password storage. Redeploy after changing variables.
For a non-Vercel production host, configure `AUTH_URL` to the canonical HTTPS origin.

No database migration is required. Missing leader credentials fail closed: nobody
can log in. Sessions use signed/encrypted JWT cookies and expire after eight hours.
Changing the password does not invalidate already issued sessions; rotate
`AUTH_SECRET` to sign out all sessions when necessary.

## Protection

- `auth.config.ts`: common session configuration and route authorization.
- `auth.ts`: Credentials provider, Zod validation, literal password comparison. Only the
  account ID, name, and email enter the session; passwords never do.
- `proxy.ts`: redirects anonymous requests for `/meetings/new` and
  `/meetings/:id/edit`. Next.js 16 renamed middleware to Proxy.
- Administrative layout and pages also require a session before rendering or
  querying an editable meeting.
- Each create/update/delete Server Action calls `requireLeaderSession()` before
  validating input or writing to Neon. Hidden UI controls are not the security boundary.
- `/api/auth/[...nextauth]` exposes the Auth.js handlers. Existing meeting GET APIs
  and public program pages remain public.
- The header reads the session on the server; pages using the root layout render
  dynamically so the account controls reflect the current request.

This implements the course's authentication basics. Public registration, password
recovery, multiple roles, and application-level login rate limiting are outside
this implementation.

## Verification

```powershell
pnpm run lint
pnpm run build
```

`scripts/verify-auth.mjs` runs the production build on port 3102 with an ephemeral
account and secret in the child process environment. It requires Edge and
`playwright-core`. To keep browser tooling outside the project:

```powershell
$authTestDir = Join-Path $env:TEMP 'sacrament-auth-verification'
pnpm add --dir $authTestDir playwright-core
$env:AUTH_TEST_PLAYWRIGHT = Join-Path $authTestDir 'node_modules/playwright-core'
node scripts/verify-auth.mjs
```

The script verifies public access, anonymous redirects, incorrect and correct
credentials, protected create/edit pages, session data, logout, and direct
unauthenticated calls to all three mutation actions. It intercepts and aborts
requests before replaying them without cookies, so it does not create, edit, or
delete meetings. Test credentials are neither saved nor printed.

Manual acceptance check:

1. Signed out, open `/meetings/new`: expect `/login`.
2. Submit incorrect credentials: expect an accessible generic error.
3. Sign in with your configured credentials: expect `/meetings` with management controls.
4. Open **New meeting** and an **Edit** page: expect the corresponding form.
5. Sign out, then reopen either protected URL: expect `/login` again.
