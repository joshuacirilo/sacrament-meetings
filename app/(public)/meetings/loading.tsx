export default function MeetingsLoading() {
  return (
    <div
      className="mx-auto w-full max-w-3xl animate-pulse"
      role="status"
      aria-label="Loading meeting program"
    >
      <div className="h-5 w-40 bg-border" />
      <div className="mt-3 h-10 w-full max-w-md bg-border" />
      <div className="mt-8 space-y-4 bg-surface p-5 shadow-sm sm:p-8">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="grid gap-2 border-b border-border py-3 last:border-0 sm:grid-cols-[11rem_1fr]"
          >
            <div className="h-4 w-28 bg-border" />
            <div className="h-4 w-full bg-border" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
