import { cn } from "@/lib/utils";

type WindCardProps = {
  windSpeed: number;
  windDirection: number;
  directionLabel: string;
  isLoading?: boolean;
  compact?: boolean;
};

// 風速に基づく Environmental Semantic Color
function windSpeedColor(speed: number): string {
  if (speed < 3) return "oklch(0.72 0.14 180)"; // teal — 穏やか
  if (speed < 8) return "oklch(0.75 0.12 220)"; // sky — やや強い
  if (speed < 15) return "oklch(0.80 0.16 85)"; // amber — 強い
  if (speed < 25) return "oklch(0.72 0.19 55)"; // orange — 非常に強い
  return "oklch(0.62 0.24 25)"; // red — 暴風
}

export function WindCard({
  windSpeed,
  windDirection,
  directionLabel,
  isLoading = false,
  compact = false,
}: WindCardProps) {
  if (isLoading) {
    return (
      <div>
        <div className="h-6 w-24 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-4 h-12 w-20 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-6 h-5 w-32 animate-pulse rounded-md bg-muted/50" />
      </div>
    );
  }

  const speedColor = windSpeedColor(windSpeed);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
          Wind
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-[0.2px]"
          style={{
            backgroundColor: `color-mix(in oklch, ${speedColor} 15%, transparent)`,
            color: speedColor,
          }}
        >
          {directionLabel}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full bg-background/60 shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/15%)]",
            compact ? "h-12 w-12" : "h-16 w-16",
          )}
        >
          <div
            className={cn(
              "absolute rounded-full border border-dashed border-foreground/20",
              compact ? "h-8 w-8" : "h-10 w-10",
            )}
          />
          <div
            className={cn(
              "absolute transition-transform duration-700",
              compact ? "h-10 w-10" : "h-12 w-12",
            )}
            style={{ transform: `rotate(${windDirection}deg)` }}
          >
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 rounded-full bg-foreground/80",
                compact ? "top-0.5 h-5 w-[2px]" : "top-1 h-7 w-[2px]",
              )}
            />
            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rotate-45 border-2 border-foreground/80 border-b-0 border-l-0" />
          </div>
        </div>
        <div>
          <div
            className={cn(
              "font-mono font-semibold tracking-[-0.5px] [font-feature-settings:'tnum']",
              compact ? "text-3xl" : "text-4xl",
            )}
          >
            {windSpeed.toFixed(1)}
          </div>
          <div className="font-mono text-sm font-normal text-muted-foreground">
            m/s
          </div>
        </div>
      </div>
      {!compact && (
        <div className="mt-5 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
          <span>北</span>
          <span>南</span>
        </div>
      )}
    </div>
  );
}
