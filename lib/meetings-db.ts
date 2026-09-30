import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

// Vercel's Neon integration prefixes the variables with `db_` in Development.
const sql = neon(process.env.DATABASE_URL ?? process.env.db_DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

export async function getMeetings(
  query: string | null = "",
  currentPage: number = 1,
): Promise<SacramentMeeting[]> {
  const searchTerm = `%${query ?? ""}%`;
  const page = Math.max(1, Math.floor(currentPage) || 1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
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
    FROM meetings
    WHERE
      presiding       ILIKE ${searchTerm}
      OR conducting   ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
      OR to_char(date, 'YYYY-MM-DD') ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
  return rows as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
  query: string | null = "",
): Promise<number> {
  const searchTerm = `%${query ?? ""}%`;

  const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding       ILIKE ${searchTerm}
      OR conducting   ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
      OR to_char(date, 'YYYY-MM-DD') ILIKE ${searchTerm}
  `;
  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
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
    FROM meetings
    WHERE id = ${id}
  `;
  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

export async function getMeetingByDate(
  date: string,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
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
    FROM meetings
    WHERE date = ${date}
  `;
  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

// Mutation stubs — will be wired to the database in Week 04
export async function addMeeting(
  data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  throw new Error("addMeeting: database implementation coming in Week 04");
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  throw new Error("updateMeeting: database implementation coming in Week 04");
}

export async function deleteMeeting(id: number): Promise<boolean> {
  throw new Error("deleteMeeting: database implementation coming in Week 04");
}
