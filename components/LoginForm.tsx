"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth-actions";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(authenticate, undefined);
  const inputClass =
    "mt-2 min-h-11 w-full border border-border-strong bg-background px-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div>
        <label htmlFor="email" className="font-medium">
          Email (required)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          aria-describedby="login-error"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="font-medium">
          Password (required)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby="login-error"
          className={inputClass}
        />
      </div>
      <p
        id="login-error"
        aria-live="polite"
        aria-atomic="true"
        className="text-sm text-red-700"
      >
        {error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center bg-accent px-4 font-semibold text-white hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
