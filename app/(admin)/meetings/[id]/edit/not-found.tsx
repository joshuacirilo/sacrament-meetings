import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl border border-border bg-surface p-6 text-center shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase text-accent">404</p>
      <h2 className="mt-1 text-2xl font-semibold text-foreground">
        Meeting not found
      </h2>
      <p className="mt-3 text-muted">
        This meeting doesn&apos;t exist or may have been deleted.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-flex min-h-11 items-center justify-center bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Back to all meetings
      </Link>
    </div>
  );
}
