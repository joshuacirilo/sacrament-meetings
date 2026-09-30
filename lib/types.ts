export type MeetingType =
  | "testimony"
  | "regular"
  | "stake"
  | "general";

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: "speaker" | "musical-number";
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string;
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}

export type MeetingInput = Omit<SacramentMeeting, "id">;

// Raw strings exactly as the meeting form submits them.
export interface MeetingFormValues {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  announcements: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusiness: string;
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: { name: string; topic: string; type: string }[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
}

export interface MeetingFormState {
  errors?: Partial<Record<keyof MeetingFormValues, string[]>>;
  message?: string | null;
  values?: MeetingFormValues;
}
