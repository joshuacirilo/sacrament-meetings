import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { MeetingDetail } from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Meeting Program",
};

export default async function MeetingDetailPage({
  params,
}: PageProps<"/meetings/[id]">) {
  const { id } = await params;
  await connection();

  const meetingId = Number(id);
  if (!Number.isInteger(meetingId)) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}
