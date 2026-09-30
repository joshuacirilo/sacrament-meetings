"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const query = searchParams.get("query") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchedRef = useRef(query);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    lastSearchedRef.current = term;
    push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  // The input is uncontrolled, so resync it when the URL changes from outside
  // (back/forward buttons, nav links) but not after our own debounced push.
  useEffect(() => {
    if (query === lastSearchedRef.current) {
      return;
    }

    lastSearchedRef.current = query;
    handleSearch.cancel();

    if (inputRef.current) {
      inputRef.current.value = query;
    }
  }, [query, handleSearch]);

  return (
    <div className="max-w-xl">
      <label htmlFor="meeting-search" className="block text-sm font-semibold text-foreground">
        Search meetings
      </label>
      <input
        ref={inputRef}
        id="meeting-search"
        type="search"
        placeholder="Speaker, leader, meeting type, or date"
        defaultValue={query}
        onChange={(event) => handleSearch(event.target.value)}
        className="mt-1 min-h-11 w-full border border-border-strong bg-surface px-4 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
    </div>
  );
}
