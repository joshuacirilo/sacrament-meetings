import { NavLinks } from "./NavLinks";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export function Header() {
  return (
    <header className="print-hidden border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-accent">
            Sacrament Meeting Planner
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Maple Grove Ward
          </h1>
          <p className="mt-1 text-sm text-muted">
            {dateFormatter.format(new Date())}
          </p>
        </div>
        <NavLinks />
      </div>
    </header>
  );
}
