import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-md rounded-[var(--radius-3xl)] bg-background/50 p-8 text-center shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%),0px_2px_4px_oklch(from_var(--foreground)_l_c_h/4%)] backdrop-blur-[40px]">
        <div className="font-mono text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
          404
        </div>
        <h1 className="mt-4 text-[1.5rem] font-semibold tracking-[-0.96px] text-foreground">
          ページが見つかりません
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          アドレスが間違っているか、ページが移動した可能性があります。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full px-4 py-2 text-xs font-medium text-muted-foreground shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%)] transition-all duration-300 hover:text-foreground hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/30%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
