import { neon } from "@neondatabase/serverless";
import type { MeetingInput, SacramentMeeting } from "./types";

// Vercel's Neon integration prefixes the variables with `db_` in Development.
const sql = neon(process.env.DATABASE_URL ?? process.env.db_DATABASE_URL!);

export const ITEMS_PER_PAGE = 5;

// Constant SQL only: never build this from user input.
const meetingColumns = sql.unsafe(`
  id,
  to_char(date, 'YYYY-MM-DD') AS "date",
  meeting_type                AS "meetingType",
  presiding, conducting, announcements,
  opening_hymn                AS "openingHymn",
  opening_prayer              AS "openingPrayer",
  ward_business               AS "wardBusiness",
  stake_business              AS "stakeBusiness",
  sacrament_hymn              AS "sacramentHymn",
  speakers,
  closing_hymn                AS "closingHymn",
  closing_prayer              AS "closingPrayer"
`);

// Backslash is the default LIKE escape character in Postgres.
function toSearchPattern(query: string | null): string {
  return `%${(query ?? "").replace(/[\\%_]/g, "\\$&")}%`;
}

export async function getMeetings(
  query: string | null = "",
  currentPage: number = 1,
): Promise<SacramentMeeting[]> {
  const searchTerm = toSearchPattern(query);
  const page = Math.max(1, Math.floor(currentPage) || 1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT ${meetingColumns}
    FROM meetings
    WHERE
      presiding       ILIKE ${searchTerm}
      OR conducting   ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements(
          CASE WHEN jsonb_typeof(speakers) = 'array' THEN speakers ELSE '[]'::jsonb END
        ) AS speaker
        WHERE speaker->>'name' ILIKE ${searchTerm}
          OR speaker->>'topic' ILIKE ${searchTerm}
      )
      OR to_char(date, 'YYYY-MM-DD') ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
  return rows as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
  query: string | null = "",
): Promise<number> {
  return Math.ceil((await getMeetingsCount(query)) / ITEMS_PER_PAGE);
}

export async function getMeetingsCount(
  query: string | null = "",
): Promise<number> {
  const searchTerm = toSearchPattern(query);

  const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding       ILIKE ${searchTerm}
      OR conducting   ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements(
          CASE WHEN jsonb_typeof(speakers) = 'array' THEN speakers ELSE '[]'::jsonb END
        ) AS speaker
        WHERE speaker->>'name' ILIKE ${searchTerm}
          OR speaker->>'topic' ILIKE ${searchTerm}
      )
      OR to_char(date, 'YYYY-MM-DD') ILIKE ${searchTerm}
  `;
  return Number(rows[0].count);
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT ${meetingColumns}
    FROM meetings
    WHERE id = ${id}
  `;
  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

export async function getMeetingByDate(
  date: string,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT ${meetingColumns}
    FROM meetings
    WHERE date = ${date}
  `;
  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

export async function addMeeting(
  data: MeetingInput,
): Promise<SacramentMeeting> {
  const rows = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${data.date},
      ${data.meetingType},
      ${data.presiding},
      ${data.conducting},
      ${data.announcements ?? []}::text[],
      ${JSON.stringify(data.openingHymn)}::jsonb,
      ${data.openingPrayer},
      ${JSON.stringify(data.wardBusiness)}::jsonb,
      ${data.stakeBusiness},
      ${JSON.stringify(data.sacramentHymn)}::jsonb,
      ${JSON.stringify(data.speakers)}::jsonb,
      ${JSON.stringify(data.closingHymn)}::jsonb,
      ${data.closingPrayer}
    )
    RETURNING ${meetingColumns}
  `;
  return rows[0] as SacramentMeeting;
}

export async function updateMeeting(
  id: number,
  data: MeetingInput,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    UPDATE meetings SET
      date           = ${data.date},
      meeting_type   = ${data.meetingType},
      presiding      = ${data.presiding},
      conducting     = ${data.conducting},
      announcements  = ${data.announcements ?? []}::text[],
      opening_hymn   = ${JSON.stringify(data.openingHymn)}::jsonb,
      opening_prayer = ${data.openingPrayer},
      ward_business  = ${JSON.stringify(data.wardBusiness)}::jsonb,
      stake_business = ${data.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(data.sacramentHymn)}::jsonb,
      speakers       = ${JSON.stringify(data.speakers)}::jsonb,
      closing_hymn   = ${JSON.stringify(data.closingHymn)}::jsonb,
      closing_prayer = ${data.closingPrayer}
    WHERE id = ${id}
    RETURNING ${meetingColumns}
  `;
  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
