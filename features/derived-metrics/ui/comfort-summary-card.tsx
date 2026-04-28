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

// Environmental Semantic Colors (DESIGN.md)
const riskColors: Record<ComfortSummaryCardProps["outdoorRiskLevel"], string> =
  {
    low: "oklch(0.72 0.14 180)",
    medium: "oklch(0.80 0.16 85)",
    high: "oklch(0.62 0.24 25)",
  };

function pm25Color(pm25: number): string {
  if (pm25 <= 12) return "oklch(0.72 0.14 180)"; // teal — good
  if (pm25 <= 35.4) return "oklch(0.80 0.16 85)"; // amber — moderate
  if (pm25 <= 55.4) return "oklch(0.72 0.19 55)"; // orange — unhealthy
  return "oklch(0.62 0.24 25)"; // red — hazardous
}

function comfortScoreColor(score: number): string {
  if (score >= 80) return "oklch(0.72 0.14 180)"; // teal — excellent
  if (score >= 60) return "oklch(0.75 0.12 220)"; // sky — good
  if (score >= 40) return "oklch(0.80 0.16 85)"; // amber — moderate
  if (score >= 20) return "oklch(0.72 0.19 55)"; // orange — poor
  return "oklch(0.62 0.24 25)"; // red — hazardous
}

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
            <div
              className="font-mono text-4xl font-semibold [font-feature-settings:'tnum']"
              style={{ color: comfortScoreColor(comfortScore) }}
            >
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
          <div className="flex items-center gap-2 text-sm font-medium">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: riskColors[outdoorRiskLevel] }}
            />
            <span style={{ color: riskColors[outdoorRiskLevel] }}>
              {riskLabels[outdoorRiskLevel]}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-[0.2px]">PM2.5</span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-medium [font-feature-settings:'tnum']"
          style={{
            backgroundColor: `color-mix(in oklch, ${pm25Color(pm25)} 15%, transparent)`,
            color: pm25Color(pm25),
          }}
        >
          {pm25.toFixed(1)} µg/m³
        </span>
      </div>
    </div>
  );
}
