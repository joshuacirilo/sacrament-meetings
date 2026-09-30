import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl border border-border bg-surface p-6 text-center shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase text-accent">404</p>
      <h2 className="mt-1 text-2xl font-semibold text-foreground">
        Page not found
      </h2>
      <p className="mt-3 text-muted">
        We couldn&apos;t find the page or meeting program you were looking for.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/meetings"
          className="inline-flex min-h-11 items-center justify-center bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to all meetings
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center border border-border-strong bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Go to home page
        </Link>
      </div>
    </div>
  );
}
