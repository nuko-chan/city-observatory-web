export type AirQualityLabel = "good" | "moderate" | "unhealthy" | "hazardous";

// 推測: PM2.5 ベースの簡易ラベル
export function classifyAirQualityLabel(pm25: number): AirQualityLabel {
  if (pm25 <= 12) return "good";
  if (pm25 <= 35.4) return "moderate";
  if (pm25 <= 55.4) return "unhealthy";
  return "hazardous";
}
