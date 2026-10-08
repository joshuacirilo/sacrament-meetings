import type { ReactNode } from "react";
import { requireLeaderSession } from "@/lib/auth-session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireLeaderSession();
  return (
    <section className="flex w-full flex-1 flex-col">
      <div className="print-hidden mb-7 border-b border-border pb-4">
        <p className="text-sm font-semibold uppercase text-accent">
          Leader tools
        </p>
      </div>
      {children}
    </section>
  );
}
