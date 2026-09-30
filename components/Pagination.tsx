"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const linkClass =
  "inline-flex min-h-11 items-center justify-center border border-accent bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const disabledClass =
  "inline-flex min-h-11 cursor-not-allowed items-center justify-center border border-border bg-surface px-4 text-sm font-semibold text-muted";

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.max(
    1,
    Math.floor(Number(searchParams.get("page"))) || 1,
  );

  if (totalPages <= 1) {
    return null;
  }

  function createPageURL(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6"
    >
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={linkClass}>
          <span aria-hidden="true">←</span>
          <span className="ml-2">Previous</span>
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          <span aria-hidden="true">←</span>
          <span className="ml-2">Previous</span>
        </span>
      )}

      <span className="text-sm text-muted" aria-live="polite">
        Page{" "}
        <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </span>

      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={linkClass}>
          <span className="mr-2">Next</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          <span className="mr-2">Next</span>
          <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  );
}
