import type { Metadata } from "next";
import { MeetingCard } from "@/components/MeetingCard";
import { getMeetings } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "All Meetings",
};

export default function MeetingsPage() {
  const meetings = getMeetings();

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

      <div className="grid gap-5 lg:grid-cols-2">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  );
}
