"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireLeaderSession } from "./auth-session";
import * as db from "./meetings-db";
import type {
  Hymn,
  MeetingFormState,
  MeetingFormValues,
  MeetingInput,
} from "./types";

const MAX_INT4 = 2147483647;

const MeetingIdSchema = z.number().int().min(1).max(MAX_INT4);

const text = (max: number) =>
  z.string().trim().max(max, { error: `Use ${max} characters or fewer.` });

const lines = z
  .string()
  .max(4000, { error: "This list is too long." })
  .transform((value) =>
    value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  );

const hymnNumber = z
  .string()
  .trim()
  .refine((value) => value === "" || /^[1-9]\d{0,3}$/.test(value), {
    error: "Enter a hymn number between 1 and 9999.",
  });

const MeetingFormSchema = z
  .object({
    date: z.iso.date({ error: "Enter a valid date." }),
    meetingType: z.enum(["testimony", "regular", "stake", "general"], {
      error: "Choose a meeting type.",
    }),
    presiding: text(100).min(1, { error: "Enter who is presiding." }),
    conducting: text(100),
    announcements: lines,
    openingHymnNumber: hymnNumber,
    openingHymnTitle: text(120),
    openingPrayer: text(100),
    wardBusiness: lines,
    stakeBusiness: z.boolean(),
    sacramentHymnNumber: hymnNumber,
    sacramentHymnTitle: text(120),
    speakers: z
      .array(
        z.object({
          name: text(100),
          topic: text(200),
          type: z.enum(["speaker", "musical-number"], {
            error: "Choose speaker or musical number.",
          }),
        }),
      )
      .max(20, { error: "Add 20 speakers or fewer." }),
    closingHymnNumber: hymnNumber,
    closingHymnTitle: text(120),
    closingPrayer: text(100),
  })
  .superRefine((meeting, ctx) => {
    const isSacramentMeeting =
      meeting.meetingType === "testimony" || meeting.meetingType === "regular";

    const required = (field: keyof MeetingFormValues, message: string) => {
      if (!meeting[field]) {
        ctx.addIssue({ code: "custom", path: [field], message });
      }
    };

    if (isSacramentMeeting) {
      required("conducting", "Enter who is conducting.");
      required("openingPrayer", "Enter who gives the opening prayer.");
      required("closingPrayer", "Enter who gives the closing prayer.");
    }

    for (const hymn of ["opening", "sacrament", "closing"] as const) {
      const number = meeting[`${hymn}HymnNumber`];
      const title = meeting[`${hymn}HymnTitle`];

      if (!isSacramentMeeting && !number && !title) {
        continue;
      }
      if (!number) {
        required(`${hymn}HymnNumber`, "Enter the hymn number.");
      }
      if (!title) {
        required(`${hymn}HymnTitle`, "Enter the hymn title.");
      }
    }

    if (meeting.speakers.some((speaker) => !speaker.name)) {
      ctx.addIssue({
        code: "custom",
        path: ["speakers"],
        message: "Every speaker or musical number needs a name.",
      });
    }
  });

type ValidMeetingForm = z.infer<typeof MeetingFormSchema>;

function toHymn(number: string, title: string): Hymn {
  // Stake and general meetings have no hymns; the seed data stores them as '{}'.
  return (number ? { number: Number(number), title } : {}) as Hymn;
}

function toMeetingInput(form: ValidMeetingForm): MeetingInput {
  return {
    date: form.date,
    meetingType: form.meetingType,
    presiding: form.presiding,
    conducting: form.conducting,
    announcements: form.announcements,
    openingHymn: toHymn(form.openingHymnNumber, form.openingHymnTitle),
    openingPrayer: form.openingPrayer,
    wardBusiness: form.wardBusiness.map((description) => ({ description })),
    stakeBusiness: form.stakeBusiness,
    sacramentHymn: toHymn(form.sacramentHymnNumber, form.sacramentHymnTitle),
    speakers: form.speakers,
    closingHymn: toHymn(form.closingHymnNumber, form.closingHymnTitle),
    closingPrayer: form.closingPrayer,
  };
}

function readFormValues(formData: FormData): MeetingFormValues {
  const get = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };
  const getAll = (name: string) =>
    formData.getAll(name).map((value) => (typeof value === "string" ? value : ""));

  const topics = getAll("speakerTopic");
  const types = getAll("speakerType");
  const speakers = getAll("speakerName")
    .map((name, index) => ({
      name,
      topic: topics[index] ?? "",
      type: types[index] ?? "speaker",
    }))
    .filter((speaker) => speaker.name.trim() || speaker.topic.trim());

  return {
    date: get("date"),
    meetingType: get("meetingType"),
    presiding: get("presiding"),
    conducting: get("conducting"),
    announcements: get("announcements"),
    openingHymnNumber: get("openingHymnNumber"),
    openingHymnTitle: get("openingHymnTitle"),
    openingPrayer: get("openingPrayer"),
    wardBusiness: get("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") === "on",
    sacramentHymnNumber: get("sacramentHymnNumber"),
    sacramentHymnTitle: get("sacramentHymnTitle"),
    speakers,
    closingHymnNumber: get("closingHymnNumber"),
    closingHymnTitle: get("closingHymnTitle"),
    closingPrayer: get("closingPrayer"),
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function duplicateDateState(values: MeetingFormValues): MeetingFormState {
  return {
    errors: { date: ["A meeting already exists for this date."] },
    message: "Please fix the highlighted fields.",
    values,
  };
}

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireLeaderSession();
  const values = readFormValues(formData);
  const validated = MeetingFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Please fix the highlighted fields.",
      values,
    };
  }

  try {
    await db.addMeeting(toMeetingInput(validated.data));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return duplicateDateState(values);
    }
    console.error("Failed to create meeting:", error);
    throw new Error("We couldn't create the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireLeaderSession();
  const values = readFormValues(formData);

  if (!MeetingIdSchema.safeParse(id).success) {
    return { message: "Invalid meeting ID.", values };
  }

  const validated = MeetingFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Please fix the highlighted fields.",
      values,
    };
  }

  let updated;
  try {
    updated = await db.updateMeeting(id, toMeetingInput(validated.data));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return duplicateDateState(values);
    }
    console.error(`Failed to update meeting ${id}:`, error);
    throw new Error("We couldn't save your changes. Please try again.");
  }

  if (!updated) {
    return { message: "This meeting no longer exists.", values };
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect("/meetings");
}

export async function deleteMeeting(id: number): Promise<void> {
  await requireLeaderSession();
  if (!MeetingIdSchema.safeParse(id).success) {
    throw new Error("Invalid meeting ID.");
  }

  try {
    await db.deleteMeeting(id);
  } catch (error) {
    console.error(`Failed to delete meeting ${id}:`, error);
    throw new Error("We couldn't delete the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
}
