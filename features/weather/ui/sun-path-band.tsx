type SunPathBandProps = {
  sunrise: string;
  sunset: string;
  progress: number;
  phaseLabel: string;
};

export function SunPathBand({
  sunrise,
  sunset,
  progress,
  phaseLabel,
}: SunPathBandProps) {
  const pct = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>☀</span>
        <span className="font-mono [font-feature-settings:'tnum']">
          {sunrise}
        </span>
      </div>

      <div className="relative flex-1">
        <div className="h-1.5 w-full rounded-full bg-muted/30">
          <div
            className="h-1.5 rounded-full bg-foreground/40 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
          style={{ left: `${pct}%` }}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/90 text-[10px] text-background shadow-sm">
            ☀
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="font-mono [font-feature-settings:'tnum']">
          {sunset}
        </span>
        <span>☽</span>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="font-mono text-xs text-muted-foreground [font-feature-settings:'tnum']">
          {Math.round(pct)}%
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-[0.2px]"
          style={{
            backgroundColor:
              "color-mix(in oklch, oklch(0.80 0.16 85) 15%, transparent)",
            color: "oklch(0.80 0.16 85)",
          }}
        >
          {phaseLabel}
        </span>
      </div>
    </div>
  );
}
