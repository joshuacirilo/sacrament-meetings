export default function MeetingsLoading() {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading meetings">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="h-5 w-24 bg-border" />
          <div className="mt-2 h-9 w-72 max-w-full bg-border" />
          <div className="mt-3 h-5 w-96 max-w-full bg-border" />
        </div>
        <div className="h-11 w-32 bg-border" />
      </div>

      <div className="mb-6 max-w-xl">
        <div className="h-5 w-32 bg-border" />
        <div className="mt-1 h-11 w-full bg-border" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex flex-col border border-border bg-surface p-5 shadow-sm"
          >
            <div className="h-5 w-32 bg-border" />
            <div className="mt-2 h-7 w-64 max-w-full bg-border" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="h-11 bg-border" />
              <div className="h-11 bg-border" />
            </div>
            <div className="mt-6 flex gap-3">
              <div className="h-11 w-32 bg-border" />
              <div className="h-11 w-16 bg-border" />
              <div className="h-11 w-20 bg-border" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
