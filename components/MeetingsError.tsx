"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export function MeetingsError({ error, retry }: MeetingsErrorProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(error);
    headingRef.current?.focus();
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase text-accent">
        Something went wrong
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-1 text-2xl font-semibold text-foreground focus:outline-none"
      >
        We couldn&apos;t load or save meeting data
      </h2>
      <p className="mt-3 text-muted">
        This is usually a temporary problem with the connection to the database.
        Try again in a moment. If it keeps happening, let the ward clerk know.
      </p>
      {error.digest && (
        <p className="mt-3 text-sm text-muted">
          Error reference: <code className="font-mono">{error.digest}</code>
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-11 items-center justify-center bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Try again
        </button>
        <Link
          href="/meetings"
          className="inline-flex min-h-11 items-center justify-center border border-border-strong bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to all meetings
        </Link>
      </div>
    </div>
  );
}
