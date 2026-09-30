import type { NextRequest } from "next/server";
import { getMeetingByDate, getMeetings } from "@/lib/meetings-db";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (date !== null) {
    const parsedDate = new Date(`${date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      return Response.json({ error: "Invalid date. Use YYYY-MM-DD." }, { status: 400 });
    }

    const meeting = await getMeetingByDate(date);
    return Response.json(meeting ? [meeting] : []);
  }

  const query = request.nextUrl.searchParams.get("query") ?? "";
  const page = Number(request.nextUrl.searchParams.get("page")) || 1;
  return Response.json(await getMeetings(query, page));
}
