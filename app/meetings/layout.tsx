export default function MeetingsLayout({
  children,
}: LayoutProps<"/meetings">) {
  return <section className="flex w-full flex-1 flex-col">{children}</section>;
}
