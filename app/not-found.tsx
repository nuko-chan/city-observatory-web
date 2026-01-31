import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-md rounded-3xl border bg-background p-8 text-center shadow-sm">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          404
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          ページが見つかりません
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          アドレスが間違っているか、ページが移動した可能性があります。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
