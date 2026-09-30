import type { ReactNode } from "react";

// Authentication for leader-only routes is scaffolded in Week 05.
export default function AdminLayout({ children }: { children: ReactNode }) {
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
