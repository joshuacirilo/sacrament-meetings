import type { Metadata } from "next";
import { CreateMeetingForm } from "@/components/CreateMeetingForm";

export const metadata: Metadata = {
  title: "Create Meeting",
};

export default function NewMeetingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="mb-6 text-3xl font-semibold text-foreground">
        Create meeting
      </h2>
      <CreateMeetingForm />
    </div>
  );
}
