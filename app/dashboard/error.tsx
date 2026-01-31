"use client";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">
          エラーが発生しました
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
