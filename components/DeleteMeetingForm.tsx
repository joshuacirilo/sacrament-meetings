"use client";

import { useFormStatus } from "react-dom";
import { deleteMeeting } from "@/lib/actions";

interface DeleteMeetingFormProps {
  id: number;
  label: string;
}

function DeleteButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center border border-red-700 bg-surface px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Deleting…" : "Delete"}
      <span className="sr-only"> program for {label}</span>
    </button>
  );
}

export function DeleteMeetingForm({ id, label }: DeleteMeetingFormProps) {
  const deleteMeetingWithId = deleteMeeting.bind(null, id);

  return (
    <form
      action={deleteMeetingWithId}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the program for ${label}? This cannot be undone.`)) {
          event.preventDefault();
          return;
        }
        // The card (and this button) is removed after deletion, so keep focus on the list.
        document.getElementById("meetings-heading")?.focus();
      }}
    >
      <DeleteButton label={label} />
    </form>
  );
}
