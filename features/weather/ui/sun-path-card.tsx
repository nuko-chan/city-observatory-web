type SunPathCardProps = {
  sunrise: string;
  sunset: string;
  nowLabel: string;
  phaseLabel: string;
  progress: number;
  background: string;
  isLoading?: boolean;
};

export function SunPathCard({
  sunrise,
  sunset,
  nowLabel,
  phaseLabel,
  progress,
  background,
  isLoading = false,
}: SunPathCardProps) {
  if (isLoading) {
    return (
      <div>
        <div className="h-6 w-24 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-6 h-16 w-full animate-pulse rounded-md bg-muted/50" />
        <div className="mt-4 h-5 w-40 animate-pulse rounded-md bg-muted/50" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>日の出/日の入り</span>
        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground">
          {phaseLabel}
        </span>
      </div>
      <div className="mt-4">
        <div
          className="relative h-24 w-full overflow-hidden rounded-xl"
          style={{ background }}
        >
          <div className="absolute inset-0">
            <svg
              viewBox="0 0 300 120"
              className="h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M20 110 C 90 20, 210 20, 280 110"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div
            className="absolute left-0 top-0 h-full w-full transition-transform duration-700"
            style={{ transform: `translateX(${progress * 100}%)` }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm shadow">
                ☀️
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 left-3 text-xs text-white/90">
            {sunrise}
          </div>
          <div className="absolute bottom-2 right-3 text-xs text-white/90">
            {sunset}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>現在 {nowLabel}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
