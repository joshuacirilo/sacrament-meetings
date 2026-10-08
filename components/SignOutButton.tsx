import { logout } from "@/lib/auth-actions";

export function SignOutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="inline-flex min-h-10 items-center border border-border-strong px-3 text-sm font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        Sign out
      </button>
    </form>
  );
}
