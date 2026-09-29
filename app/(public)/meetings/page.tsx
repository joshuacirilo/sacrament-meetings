import type { Metadata } from "next";
import { MeetingCard } from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "All Meetings",
};

export default async function MeetingsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-accent">Programs</p>
        <h2 className="mt-1 text-3xl font-semibold text-foreground">
          Sacrament meetings
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Review current and past meeting agendas for Maple Grove Ward.
        </p>
      </div>

      <div className="mb-6">
        <MeetingSearch />
      </div>

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
