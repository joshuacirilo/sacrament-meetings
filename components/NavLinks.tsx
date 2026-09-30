"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
];

const meetingLinks = [
  { href: "/meetings", label: "All meetings" },
  { href: "/meetings/current", label: "Current Sunday" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const isHome = link.href === "/";
          const isActive =
            pathname === link.href ||
            (link.href !== "/" &&
              link.href === "/meetings" &&
              pathname.startsWith("/meetings/") &&
              pathname !== "/meetings/current");

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-10 items-center px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isHome
                    ? isActive
                      ? "bg-accent-strong text-white"
                      : "bg-accent text-white hover:bg-accent-strong"
                    : isActive
                      ? "border-b-2 border-accent text-accent"
                      : "border-b-2 border-transparent text-muted hover:border-border-strong hover:text-foreground"
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

export function MeetingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Meetings navigation">
      <ul className="flex flex-wrap gap-2">
        {meetingLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href === "/meetings" && /^\/meetings\/\d+$/.test(pathname));

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-10 items-center border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive
                    ? "border-accent bg-accent text-white"
                    : "border-border-strong bg-surface text-foreground hover:bg-background"
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
