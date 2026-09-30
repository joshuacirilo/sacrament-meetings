"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import type {
  Hymn,
  MeetingFormState,
  MeetingFormValues,
  SacramentMeeting,
} from "@/lib/types";

interface MeetingFormProps {
  state: MeetingFormState;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  meeting?: SacramentMeeting;
  submitLabel: string;
}

type FieldName = keyof MeetingFormValues;

const meetingTypeOptions = [
  { value: "regular", label: "Regular sacrament meeting" },
  { value: "testimony", label: "Fast and testimony meeting" },
  { value: "stake", label: "Stake conference" },
  { value: "general", label: "General meeting" },
];

const inputClass =
  "min-h-11 w-full border border-border-strong bg-surface px-3 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-red-700";

export const initialState: MeetingFormState = { errors: {}, message: null };

function hymnValues(hymn: Hymn | undefined) {
  return {
    number: hymn?.number ? String(hymn.number) : "",
    title: hymn?.title ?? "",
  };
}

function toFormValues(meeting?: SacramentMeeting): MeetingFormValues {
  const opening = hymnValues(meeting?.openingHymn);
  const sacrament = hymnValues(meeting?.sacramentHymn);
  const closing = hymnValues(meeting?.closingHymn);

  return {
    date: meeting?.date ?? "",
    meetingType: meeting?.meetingType ?? "regular",
    presiding: meeting?.presiding ?? "",
    conducting: meeting?.conducting ?? "",
    announcements: meeting?.announcements?.join("\n") ?? "",
    openingHymnNumber: opening.number,
    openingHymnTitle: opening.title,
    openingPrayer: meeting?.openingPrayer ?? "",
    wardBusiness:
      meeting?.wardBusiness?.map((item) => item.description).join("\n") ?? "",
    stakeBusiness: meeting?.stakeBusiness ?? false,
    sacramentHymnNumber: sacrament.number,
    sacramentHymnTitle: sacrament.title,
    speakers: meeting?.speakers ?? [],
    closingHymnNumber: closing.number,
    closingHymnTitle: closing.title,
    closingPrayer: meeting?.closingPrayer ?? "",
  };
}

// Always rendered: a live region must already be in the DOM for its updates to be announced.
function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error, index) => (
        <p key={`${error}-${index}`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      ))}
    </div>
  );
}

function Field({
  name,
  label,
  hint,
  required,
  errors,
  children,
}: {
  name: FieldName;
  label: string;
  hint?: string;
  required?: boolean;
  errors?: string[];
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="font-normal text-muted"> (required)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="mt-1">{children}</div>
      <FieldError id={`${name}-error`} errors={errors} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 border border-border bg-surface p-5 sm:grid-cols-2">
      <legend className="px-1 text-lg font-semibold text-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

export function MeetingForm({
  state,
  formAction,
  isPending,
  meeting,
  submitLabel,
}: MeetingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const values = state.values ?? toFormValues(meeting);
  const errors = state.errors ?? {};

  useEffect(() => {
    if (!state.message) {
      return;
    }

    const target =
      formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]") ??
      formRef.current?.querySelector<HTMLElement>("#form-message > p");
    target?.focus();
  }, [state]);

  const describedBy = (name: FieldName, hasHint = false) =>
    hasHint ? `${name}-hint ${name}-error` : `${name}-error`;

  const textInput = (name: FieldName, props: { type?: string; required?: boolean } = {}) => (
    <input
      id={name}
      name={name}
      type={props.type ?? "text"}
      required={props.required}
      defaultValue={values[name] as string}
      aria-invalid={errors[name]?.length ? true : undefined}
      aria-describedby={describedBy(name)}
      className={inputClass}
    />
  );

  const hymnFields = (hymn: "opening" | "sacrament" | "closing", label: string) => {
    const numberName = `${hymn}HymnNumber` as const;
    const titleName = `${hymn}HymnTitle` as const;

    return (
      <>
        <Field name={numberName} label={`${label} number`} errors={errors[numberName]}>
          <input
            id={numberName}
            name={numberName}
            type="number"
            min={1}
            max={9999}
            inputMode="numeric"
            defaultValue={values[numberName]}
            aria-invalid={errors[numberName]?.length ? true : undefined}
            aria-describedby={describedBy(numberName)}
            className={inputClass}
          />
        </Field>
        <Field name={titleName} label={`${label} title`} errors={errors[titleName]}>
          {textInput(titleName)}
        </Field>
      </>
    );
  };

  const speakerRows = Math.max(4, values.speakers.length + 1);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6" noValidate>
      <div id="form-message" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p
            tabIndex={-1}
            className="border border-red-700 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            {state.message}
          </p>
        )}
      </div>

      <p id="form-instructions" className="text-sm text-muted">
        Fields marked (required) are always needed. For regular and fast and
        testimony meetings, conducting, both prayers, and all three hymns are
        also required.
      </p>

      <Section title="Meeting details">
        <Field name="date" label="Date" required errors={errors.date}>
          {textInput("date", { type: "date", required: true })}
        </Field>
        <Field name="meetingType" label="Meeting type" errors={errors.meetingType}>
          <select
            key={values.meetingType}
            id="meetingType"
            name="meetingType"
            defaultValue={values.meetingType}
            aria-invalid={errors.meetingType?.length ? true : undefined}
            aria-describedby={describedBy("meetingType")}
            className={inputClass}
          >
            {meetingTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field name="presiding" label="Presiding" required errors={errors.presiding}>
          {textInput("presiding", { required: true })}
        </Field>
        <Field name="conducting" label="Conducting" errors={errors.conducting}>
          {textInput("conducting")}
        </Field>
        <div className="sm:col-span-2">
          <Field
            name="announcements"
            label="Announcements"
            hint="One announcement per line."
            errors={errors.announcements}
          >
            <textarea
              id="announcements"
              name="announcements"
              rows={3}
              defaultValue={values.announcements}
              aria-invalid={errors.announcements?.length ? true : undefined}
              aria-describedby={describedBy("announcements", true)}
              className={`${inputClass} py-2`}
            />
          </Field>
        </div>
      </Section>

      <Section title="Opening">
        {hymnFields("opening", "Opening hymn")}
        <Field name="openingPrayer" label="Opening prayer" errors={errors.openingPrayer}>
          {textInput("openingPrayer")}
        </Field>
      </Section>

      <Section title="Business">
        <div className="sm:col-span-2">
          <Field
            name="wardBusiness"
            label="Ward business"
            hint="One item per line, for example “Sustain - Sister Park - Primary Teacher”."
            errors={errors.wardBusiness}
          >
            <textarea
              id="wardBusiness"
              name="wardBusiness"
              rows={3}
              defaultValue={values.wardBusiness}
              aria-invalid={errors.wardBusiness?.length ? true : undefined}
              aria-describedby={describedBy("wardBusiness", true)}
              className={`${inputClass} py-2`}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <div className="flex min-h-11 items-center gap-3">
            <input
              id="stakeBusiness"
              name="stakeBusiness"
              type="checkbox"
              defaultChecked={values.stakeBusiness}
              aria-describedby={describedBy("stakeBusiness")}
              className="size-5 accent-accent"
            />
            <label htmlFor="stakeBusiness" className="text-foreground">
              Stake business will be conducted
            </label>
          </div>
          <FieldError id="stakeBusiness-error" errors={errors.stakeBusiness} />
        </div>
      </Section>

      <Section title="Sacrament">
        {hymnFields("sacrament", "Sacrament hymn")}
      </Section>

      <fieldset className="border border-border bg-surface p-5">
        <legend className="px-1 text-lg font-semibold text-foreground">
          Speakers and music
        </legend>
        <p id="speakers-hint" className="text-sm text-muted">
          Leave extra rows empty. For musical numbers, use the topic for the song title.
        </p>
        <ol className="mt-4 flex flex-col gap-4">
          {Array.from({ length: speakerRows }, (_, index) => {
            const speaker = values.speakers[index];
            const rowLabel = `Program item ${index + 1}`;
            const nameMissing =
              Boolean(errors.speakers?.length) && speaker !== undefined && !speaker.name.trim();

            return (
              <li
                key={index}
                className="grid gap-3 border-b border-border pb-4 last:border-0 sm:grid-cols-[1fr_1fr_12rem]"
              >
                <div>
                  <label htmlFor={`speakerName-${index}`} className="block text-sm font-semibold">
                    <span className="sr-only">{rowLabel} </span>Name
                  </label>
                  <input
                    id={`speakerName-${index}`}
                    name="speakerName"
                    defaultValue={speaker?.name ?? ""}
                    aria-invalid={nameMissing || undefined}
                    aria-describedby="speakers-hint speakers-error"
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label htmlFor={`speakerTopic-${index}`} className="block text-sm font-semibold">
                    <span className="sr-only">{rowLabel} </span>Topic
                  </label>
                  <input
                    id={`speakerTopic-${index}`}
                    name="speakerTopic"
                    defaultValue={speaker?.topic ?? ""}
                    aria-describedby="speakers-hint speakers-error"
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label htmlFor={`speakerType-${index}`} className="block text-sm font-semibold">
                    <span className="sr-only">{rowLabel} </span>Type
                  </label>
                  <select
                    key={speaker?.type ?? "speaker"}
                    id={`speakerType-${index}`}
                    name="speakerType"
                    defaultValue={speaker?.type ?? "speaker"}
                    aria-describedby="speakers-error"
                    className={`${inputClass} mt-1`}
                  >
                    <option value="speaker">Speaker</option>
                    <option value="musical-number">Musical number</option>
                  </select>
                </div>
              </li>
            );
          })}
        </ol>
        <FieldError id="speakers-error" errors={errors.speakers} />
      </fieldset>

      <Section title="Closing">
        {hymnFields("closing", "Closing hymn")}
        <Field name="closingPrayer" label="Closing prayer" errors={errors.closingPrayer}>
          {textInput("closingPrayer")}
        </Field>
      </Section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/meetings"
          className="inline-flex min-h-11 items-center justify-center border border-border-strong bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
