"use client";

import { useActionState } from "react";
import { createMeeting } from "@/lib/actions";
import { initialState, MeetingForm } from "./MeetingForm";

export function CreateMeetingForm() {
  const [state, formAction, isPending] = useActionState(
    createMeeting,
    initialState,
  );

  return (
    <MeetingForm
      state={state}
      formAction={formAction}
      isPending={isPending}
      submitLabel="Create meeting"
    />
  );
}
