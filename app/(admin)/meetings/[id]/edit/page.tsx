import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditMeetingForm } from "@/components/EditMeetingForm";
import { getMeetingById } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Edit Meeting",
};

const MAX_INT4 = 2147483647;

export default async function EditMeetingPage({
  params,
}: PageProps<"/meetings/[id]/edit">) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId < 1 || meetingId > MAX_INT4) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="mb-6 text-3xl font-semibold text-foreground">
        Edit meeting
      </h2>
      <EditMeetingForm meeting={meeting} />
    </div>
  );
}
