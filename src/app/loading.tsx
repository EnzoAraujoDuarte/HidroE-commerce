export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-bg">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(12,10,9,0),rgba(12,10,9,0.85),rgba(12,10,9,0))]" />
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-px w-20 bg-border overflow-hidden">
            <div className="h-full w-10 bg-text animate-[loading-line_1s_ease-in-out_infinite]" />
          </div>
          <span className="mt-6 text-[11px] uppercase tracking-[0.32em] text-text-muted">
            Entering
          </span>
        </div>
      </div>
    </div>
  )
}
