import type { NextRequest } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  return Response.json(await getMeetings(date));
}
