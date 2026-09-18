"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/meetings/current", label: "Current program" },
  { href: "/meetings", label: "All meetings" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href === "/meetings" &&
              pathname.startsWith("/meetings/") &&
              pathname !== "/meetings/current");

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-10 items-center border-b-2 px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:border-border-strong hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
