export default function MeetingProgramLoading() {
  return (
    <div
      className="mx-auto flex w-full max-w-3xl animate-pulse flex-col gap-4"
      role="status"
      aria-label="Loading meeting program"
    >
      <div className="h-11 w-36 self-end bg-border" />
      <div className="w-full bg-surface p-5 shadow-sm sm:p-8">
        <div className="flex flex-col items-center border-b-2 border-border pb-6">
          <div className="h-5 w-56 bg-border" />
          <div className="mt-3 h-9 w-80 max-w-full bg-border" />
          <div className="mt-3 h-6 w-64 max-w-full bg-border" />
        </div>
        <div className="mt-4">
          {Array.from({ length: 11 }, (_, index) => (
            <div
              key={index}
              className="grid gap-2 border-b border-border py-4 last:border-0 sm:grid-cols-[11rem_1fr] sm:gap-6"
            >
              <div className="h-5 w-28 bg-border" />
              <div className="h-5 w-full bg-border" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
