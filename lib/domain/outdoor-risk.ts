type OutdoorRiskInput = {
  precipitationProbability: number;
  windSpeed: number;
  pm25: number;
};

// 推測: 雨・風・PM2.5 を重み付けした簡易リスク
export function calculateOutdoorRisk(
  input: OutdoorRiskInput,
): "low" | "medium" | "high" {
  const score =
    input.precipitationProbability * 0.6 +
    input.windSpeed * 5 +
    input.pm25 * 0.4;

  if (score < 35) return "low";
  if (score < 70) return "medium";
  return "high";
}
