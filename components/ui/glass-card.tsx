import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = ComponentProps<"div"> & {
  hoverable?: boolean;
};

/**
 * DESIGN.md 準拠のグラスモーフィズムカード。
 * shadow-as-border（Vercel）+ frosted glass（Sentry）の統合深度システム。
 */
export function GlassCard({
  className,
  hoverable = true,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // L2 Float: グラスモーフィズムカード静止状態
        "rounded-[var(--radius-3xl)] bg-background/50 p-6 backdrop-blur-[40px] backdrop-saturate-150",
        // shadow-as-border (Vercel ring-border) + 微小浮遊感
        "shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%),0px_2px_4px_oklch(from_var(--foreground)_l_c_h/4%)]",
        "transition-all duration-300",
        // L3 Elevate: ホバー状態
        hoverable &&
          "hover:-translate-y-1 hover:bg-background/60 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%),0px_8px_24px_oklch(from_var(--foreground)_l_c_h/8%)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
