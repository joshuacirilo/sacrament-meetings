import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Meeting",
};

export default async function EditMeetingPage({
  params,
}: PageProps<"/meetings/[id]/edit">) {
  const { id } = await params;

  return (
    <h2 className="text-3xl font-semibold text-foreground">
      Edit Meeting #{id} — Coming in Week 04
    </h2>
  );
}
