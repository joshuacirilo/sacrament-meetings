import type { SacramentMeeting } from "./types";

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-08-23",
    meetingType: "regular",
    presiding: "Bishop Daniel Morales",
    conducting: "James Carter",
    announcements: [
      "Youth activity on Wednesday at 7:00 PM.",
      "Ward temple night is Friday at 6:30 PM.",
    ],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Rachel Bennett",
    wardBusiness: [{ description: "Sustain Emma Reed as Primary secretary." }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: "Olivia Martinez", topic: "Faith in Jesus Christ", type: "speaker" },
      { name: "Thomas Wilson", topic: "Daily discipleship", type: "speaker" },
    ],
    closingHymn: { number: 301, title: "I Am a Child of God" },
    closingPrayer: "Michael Reed",
  },
  {
    id: 2,
    date: "2026-08-30",
    meetingType: "regular",
    presiding: "Bishop Daniel Morales",
    conducting: "Samuel Ortiz",
    announcements: ["Choir practice begins after the second hour."],
    openingHymn: { number: 6, title: "Redeemer of Israel" },
    openingPrayer: "Hannah Lee",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 172, title: "In Humility, Our Savior" },
    speakers: [
      { name: "Ward Choir", topic: "Come, Follow Me", type: "musical-number" },
      { name: "Jacob Nguyen", topic: "Serving our neighbors", type: "speaker" },
    ],
    closingHymn: { number: 223, title: "Have I Done Any Good?" },
    closingPrayer: "Grace Kim",
  },
  {
    id: 3,
    date: "2026-09-06",
    meetingType: "testimony",
    presiding: "Bishop Daniel Morales",
    conducting: "James Carter",
    announcements: ["Fast-offering donations will be collected today."],
    openingHymn: { number: 21, title: "Come, Listen to a Prophet's Voice" },
    openingPrayer: "Noah Thompson",
    wardBusiness: [{ description: "Release David Young as ward clerk." }],
    stakeBusiness: false,
    sacramentHymn: { number: 174, title: "While of These Emblems We Partake" },
    speakers: [
      { name: "Congregation", topic: "Fast and testimony meeting", type: "speaker" },
    ],
    closingHymn: { number: 137, title: "Testimony" },
    closingPrayer: "Sophia Adams",
  },
  {
    id: 4,
    date: "2026-09-13",
    meetingType: "stake",
    presiding: "President Robert Hayes",
    conducting: "President Mark Sullivan",
    announcements: ["Stake conference sessions continue this afternoon."],
    openingHymn: { number: 5, title: "High on the Mountain Top" },
    openingPrayer: "Linda Parker",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 173, title: "While of These Emblems We Partake" },
    speakers: [
      { name: "President Mark Sullivan", topic: "Strengthening families", type: "speaker" },
      { name: "Stake Youth Choir", topic: "I Know That My Redeemer Lives", type: "musical-number" },
      { name: "President Robert Hayes", topic: "Covenant belonging", type: "speaker" },
    ],
    closingHymn: { number: 134, title: "I Believe in Christ" },
    closingPrayer: "Andrew Collins",
  },
  {
    id: 5,
    date: "2026-09-20",
    meetingType: "general",
    presiding: "President Henry Lawson",
    conducting: "Elder Matthew Brooks",
    announcements: ["The meeting will be followed by a family history workshop."],
    openingHymn: { number: 85, title: "How Firm a Foundation" },
    openingPrayer: "Emily Johnson",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 196, title: "Jesus, Once of Humble Birth" },
    speakers: [
      { name: "Sarah Williams", topic: "Personal revelation", type: "speaker" },
      { name: "Elder Matthew Brooks", topic: "Gathering Israel", type: "speaker" },
    ],
    closingHymn: { number: 3, title: "Now Let Us Rejoice" },
    closingPrayer: "Benjamin Taylor",
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  const results = date
    ? meetings.filter((meeting) => meeting.date === date)
    : meetings;

  return [...results].sort((a, b) => b.date.localeCompare(a.date));
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}

export function getMeetingByDate(date: string): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.date === date);
}

export function getCurrentMeeting(
  referenceDate: string = new Date().toISOString().slice(0, 10),
): SacramentMeeting | undefined {
  return getMeetings().find((meeting) => meeting.date <= referenceDate);
}
