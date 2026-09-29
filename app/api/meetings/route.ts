import type { NextRequest } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  return Response.json(getMeetings(date));
}
