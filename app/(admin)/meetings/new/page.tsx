import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Meeting",
};

export default function NewMeetingPage() {
  return (
    <h2 className="text-3xl font-semibold text-foreground">
      Create Meeting — Coming in Week 04
    </h2>
  );
}
