import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeetingDetail } from "@/components/MeetingDetail";
import { getCurrentMeeting } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Current Program",
};

export default function CurrentMeetingPage() {
  const meeting = getCurrentMeeting();

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}
