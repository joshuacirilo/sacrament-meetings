import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="overflow-hidden bg-surface shadow-sm">
      <Image
        src="/meetinghouse.png"
        alt="Maple Grove Ward meetinghouse surrounded by trees on a Sunday morning"
        width={1920}
        height={818}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 1152px"
        className="aspect-[16/7] w-full object-cover"
      />
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-sm font-semibold uppercase text-accent">
          Maple Grove Ward
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
          Sacrament Meeting Planner
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Review this Sunday&apos;s program or browse previous meeting agendas.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/meetings/current"
            className="inline-flex min-h-11 items-center bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View current program
          </Link>
          <Link
            href="/meetings"
            className="inline-flex min-h-11 items-center border border-border-strong px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Browse all meetings
          </Link>
        </div>
      </div>
    </section>
  );
}
