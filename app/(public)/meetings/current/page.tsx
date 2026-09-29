import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getMeetingByDate } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "Current Program",
};

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function CurrentMeetingPage() {
  await connection();

  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  const meeting = await getMeetingByDate(formatLocalDate(sunday));

  if (!meeting) {
    redirect("/meetings");
  }

  redirect(`/meetings/${meeting.id}`);
}
