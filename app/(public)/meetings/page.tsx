import type { Metadata } from "next";
import Link from "next/link";
import { MeetingCard } from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import {
  getMeetings,
  getMeetingsCount,
  ITEMS_PER_PAGE,
} from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "All Meetings",
};

export default async function MeetingsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  const [meetings, totalCount] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsCount(query),
  ]);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-accent">Programs</p>
          <h2
            id="meetings-heading"
            tabIndex={-1}
            className="mt-1 text-3xl font-semibold text-foreground focus:outline-none"
          >
            Sacrament meetings
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Review current and past meeting agendas for Maple Grove Ward.
          </p>
        </div>
        <Link
          href="/meetings/new"
          className="inline-flex min-h-11 items-center justify-center bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          New meeting
        </Link>
      </div>

      <div className="mb-6">
        <MeetingSearch />
      </div>

      <p role="status" className="sr-only">
        {totalCount === 1 ? "1 meeting found" : `${totalCount} meetings found`}
      </p>

      {meetings.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <p className="border border-border bg-surface p-5 text-muted">
          No meetings match your search.
        </p>
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}
