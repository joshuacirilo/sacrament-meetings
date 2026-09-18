import type { ReactNode } from "react";
import type { Hymn, SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

const meetingTypeLabels: Record<SacramentMeeting["meetingType"], string> = {
  testimony: "Fast and testimony meeting",
  regular: "Regular sacrament meeting",
  stake: "Stake conference (non-sacrament meeting)",
  general: "General meeting (non-sacrament meeting)",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function AgendaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-4 last:border-0 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="text-sm font-semibold text-muted">{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}

function HymnDetails({ hymn }: { hymn: Hymn }) {
  return (
    <span>
      <span className="font-semibold">#{hymn.number}</span> {hymn.title}
    </span>
  );
}

export function MeetingDetail({ meeting }: MeetingDetailProps) {
  return (
    <article className="print-program mx-auto w-full max-w-3xl bg-surface p-5 shadow-sm sm:p-8">
      <header className="border-b-2 border-accent pb-6 text-center">
        <p className="text-sm font-semibold uppercase text-accent">
          {meetingTypeLabels[meeting.meetingType]}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground">
          Sacrament Meeting Program
        </h2>
        <time className="mt-2 block text-muted" dateTime={meeting.date}>
          {dateFormatter.format(new Date(`${meeting.date}T00:00:00Z`))}
        </time>
      </header>

      <dl className="mt-4">
        <AgendaRow label="Presiding">{meeting.presiding}</AgendaRow>
        <AgendaRow label="Conducting">{meeting.conducting}</AgendaRow>
        <AgendaRow label="Announcements">
          {meeting.announcements?.length ? (
            <ul className="list-disc space-y-1 pl-5">
              {meeting.announcements.map((announcement) => (
                <li key={announcement}>{announcement}</li>
              ))}
            </ul>
          ) : (
            "None"
          )}
        </AgendaRow>
        <AgendaRow label="Opening hymn">
          <HymnDetails hymn={meeting.openingHymn} />
        </AgendaRow>
        <AgendaRow label="Opening prayer">{meeting.openingPrayer}</AgendaRow>
        <AgendaRow label="Ward business">
          {meeting.wardBusiness.length ? (
            <ul className="list-disc space-y-1 pl-5">
              {meeting.wardBusiness.map((item, index) => (
                <li key={`${item.description}-${index}`}>{item.description}</li>
              ))}
            </ul>
          ) : (
            "None"
          )}
        </AgendaRow>
        <AgendaRow label="Stake business">
          {meeting.stakeBusiness ? "Yes" : "No"}
        </AgendaRow>
        <AgendaRow label="Sacrament hymn">
          <HymnDetails hymn={meeting.sacramentHymn} />
        </AgendaRow>
        <AgendaRow label="Speakers and music">
          {meeting.speakers.length ? (
            <ol className="space-y-4">
              {meeting.speakers.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.type === "musical-number"
                      ? `Musical number: ${item.topic}`
                      : `Topic: ${item.topic}`}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            "None"
          )}
        </AgendaRow>
        <AgendaRow label="Closing hymn">
          <HymnDetails hymn={meeting.closingHymn} />
        </AgendaRow>
        <AgendaRow label="Closing prayer">{meeting.closingPrayer}</AgendaRow>
      </dl>
    </article>
  );
}
