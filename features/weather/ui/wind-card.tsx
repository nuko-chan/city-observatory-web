type WindCardProps = {
  windSpeed: number;
  windDirection: number;
  directionLabel: string;
  isLoading?: boolean;
};

export function WindCard({
  windSpeed,
  windDirection,
  directionLabel,
  isLoading = false,
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

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>風向き・風速</span>
        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground">
          {directionLabel}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-foreground/15 bg-background/60">
          <div className="absolute h-10 w-10 rounded-full border border-dashed border-foreground/20" />
          <div
            className="absolute h-12 w-12 transition-transform duration-700"
            style={{ transform: `rotate(${windDirection}deg)` }}
          >
            <div className="absolute left-1/2 top-1 h-7 w-[2px] -translate-x-1/2 rounded-full bg-foreground/80" />
            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rotate-45 border-2 border-foreground/80 border-b-0 border-l-0" />
          </div>
        </div>
        <div>
          <div className="text-4xl font-bold tracking-tight">
            {windSpeed.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">m/s</div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span>北</span>
        <span>南</span>
      </div>
    </div>
  );
}
