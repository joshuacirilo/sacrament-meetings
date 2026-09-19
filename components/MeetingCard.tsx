import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

const meetingTypeLabels: Record<SacramentMeeting["meetingType"], string> = {
  testimony: "Testimony meeting",
  regular: "Regular meeting",
  stake: "Stake conference",
  general: "General meeting",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <article className="flex h-full flex-col border border-border bg-surface p-5 shadow-sm transition hover:border-border-strong hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent">
            {meetingTypeLabels[meeting.meetingType]}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">
            {dateFormatter.format(new Date(`${meeting.date}T00:00:00Z`))}
          </h3>
        </div>
        {meeting.stakeBusiness && (
          <span className="border border-border-strong bg-background px-2 py-1 text-xs font-medium text-muted">
            Stake business
          </span>
        )}
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-muted">Presiding</dt>
          <dd className="mt-1 text-foreground">{meeting.presiding}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted">Conducting</dt>
          <dd className="mt-1 text-foreground">{meeting.conducting}</dd>
        </div>
      </dl>

      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-6 inline-flex min-h-11 items-center justify-center self-start bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        View program
      </Link>
    </article>
  );
}
