import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";
import { DeleteMeetingForm } from "./DeleteMeetingForm";

interface MeetingCardProps {
  meeting: SacramentMeeting;
  canManage?: boolean;
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

export function MeetingCard({ meeting, canManage = false }: MeetingCardProps) {
  const formattedDate = dateFormatter.format(
    new Date(`${meeting.date}T00:00:00Z`),
  );

  return (
    <article className="flex h-full flex-col border border-border bg-surface p-5 shadow-sm transition hover:border-border-strong hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent">
            {meetingTypeLabels[meeting.meetingType]}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">
            {formattedDate}
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

      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <Link
          href={`/meetings/${meeting.id}`}
          className="inline-flex min-h-11 items-center justify-center bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View program
        </Link>
        {canManage && (
          <>
            <Link
              href={`/meetings/${meeting.id}/edit`}
              className="inline-flex min-h-11 items-center justify-center border border-border-strong bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Edit<span className="sr-only"> program for {formattedDate}</span>
            </Link>
            <DeleteMeetingForm id={meeting.id} label={formattedDate} />
          </>
        )}
      </div>
    </article>
  );
}
