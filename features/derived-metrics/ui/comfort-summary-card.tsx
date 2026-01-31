type ComfortSummaryCardProps = {
  comfortScore: number;
  outdoorRiskLevel: "low" | "medium" | "high";
  pm25: number;
  isLoading?: boolean;
};

const riskLabels: Record<ComfortSummaryCardProps["outdoorRiskLevel"], string> =
  {
    low: "低",
    medium: "中",
    high: "高",
  };

const riskColors: Record<ComfortSummaryCardProps["outdoorRiskLevel"], string> =
  {
    low: "bg-emerald-400/70",
    medium: "bg-amber-400/80",
    high: "bg-rose-400/80",
  };

export function ComfortSummaryCard({
  comfortScore,
  outdoorRiskLevel,
  pm25,
  isLoading,
}: ComfortSummaryCardProps) {
  if (isLoading) {
    return (
      <div className="h-[140px] w-full animate-pulse rounded-3xl border border-foreground/10 bg-muted/30 backdrop-blur-2xl" />
    );
  }

  return (
    <div className="rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Comfort Summary
          </div>
          <div className="mt-3 flex items-end gap-2">
            <div className="text-4xl font-semibold text-foreground">
              {comfortScore}
            </div>
            <div className="pb-1 text-sm text-muted-foreground">/100</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Outdoor Risk
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span
              className={`h-2 w-2 rounded-full ${riskColors[outdoorRiskLevel]}`}
            />
            {riskLabels[outdoorRiskLevel]}
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        PM2.5: {pm25.toFixed(1)} µg/m³
      </div>
    </div>
  );
}
