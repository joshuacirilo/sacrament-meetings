import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Leader Sign In" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/meetings");

  return (
    <section className="mx-auto w-full max-w-md border border-border bg-surface p-6 sm:p-8">
      <h2 className="text-3xl font-semibold">Leader sign in</h2>
      <p className="mt-3 text-muted">Sign in to create, edit, and delete meeting programs.</p>
      <LoginForm />
    </section>
  );
}
