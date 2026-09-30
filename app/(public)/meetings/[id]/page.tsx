import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { MeetingDetail } from "@/components/MeetingDetail";
import { getApiUrl } from "@/lib/api-url";
import type { SacramentMeeting } from "@/lib/types";

export const metadata: Metadata = {
  title: "Meeting Program",
};

export default async function MeetingDetailPage({
  params,
}: PageProps<"/meetings/[id]">) {
  const { id } = await params;
  await connection();

  const response = await fetch(await getApiUrl(`/api/meetings/${id}`), {
    cache: "no-store",
  });

  if (response.status === 400 || response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load the meeting.");
  }

  const meeting: SacramentMeeting = await response.json();

  return <MeetingDetail meeting={meeting} />;
}
