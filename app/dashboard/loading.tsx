export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="h-44 w-full animate-pulse rounded-2xl border bg-muted/30" />
            <div className="h-[320px] w-full animate-pulse rounded-2xl border bg-muted/30" />
            <div className="h-44 w-full animate-pulse rounded-2xl border bg-muted/30" />
            <div className="h-[320px] w-full animate-pulse rounded-2xl border bg-muted/30" />
          </div>
          <div className="h-[420px] w-full animate-pulse rounded-2xl border bg-muted/30 lg:h-auto" />
        </div>
      </div>
    </div>
  );
}
