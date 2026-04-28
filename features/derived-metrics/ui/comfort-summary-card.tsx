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
    low: "bg-foreground/30",
    medium: "bg-foreground/50",
    high: "bg-foreground/70",
  };

export function ComfortSummaryCard({
  comfortScore,
  outdoorRiskLevel,
  pm25,
  isLoading,
}: ComfortSummaryCardProps) {
  if (isLoading) {
    return (
      <div>
        <div className="h-6 w-24 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-4 h-10 w-20 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-6 h-5 w-32 animate-pulse rounded-md bg-muted/50" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
            Comfort
          </div>
          <div className="mt-3 flex items-end gap-2">
            <div className="font-mono text-4xl font-semibold text-foreground [font-feature-settings:'tnum']">
              {comfortScore}
            </div>
            <div className="pb-1 font-mono text-sm font-normal text-muted-foreground">
              /100
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
            外出リスク
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
        <span className="font-medium uppercase tracking-[0.2px]">PM2.5</span>{" "}
        <span className="font-mono [font-feature-settings:'tnum']">
          {pm25.toFixed(1)}
        </span>{" "}
        <span className="font-mono text-xs">µg/m³</span>
      </div>
    </div>
  );
}
