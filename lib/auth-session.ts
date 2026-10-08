import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireLeaderSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}
