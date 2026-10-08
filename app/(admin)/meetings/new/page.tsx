import type { Metadata } from "next";
import { CreateMeetingForm } from "@/components/CreateMeetingForm";
import { requireLeaderSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Create Meeting",
};

export default async function NewMeetingPage() {
  await requireLeaderSession();
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="mb-6 text-3xl font-semibold text-foreground">
        Create meeting
      </h2>
      <CreateMeetingForm />
    </div>
  );
}
