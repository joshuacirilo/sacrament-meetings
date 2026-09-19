import { MeetingsNav } from "@/components/NavLinks";

export default function MeetingsLayout({
  children,
}: LayoutProps<"/meetings">) {
  return (
    <section className="flex w-full flex-1 flex-col">
      <div className="print-hidden mb-7 border-b border-border pb-4">
        <MeetingsNav />
      </div>
      {children}
    </section>
  );
}
