"use client";

import { useActionState } from "react";
import { updateMeeting } from "@/lib/actions";
import type { SacramentMeeting } from "@/lib/types";
import { initialState, MeetingForm } from "./MeetingForm";

export function EditMeetingForm({ meeting }: { meeting: SacramentMeeting }) {
  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);
  const [state, formAction, isPending] = useActionState(
    updateMeetingWithId,
    initialState,
  );

  return (
    <MeetingForm
      state={state}
      formAction={formAction}
      isPending={isPending}
      meeting={meeting}
      submitLabel="Save changes"
    />
  );
}
