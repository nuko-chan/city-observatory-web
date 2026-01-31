import type { AirQualityHourly } from "@/lib/types/air-quality";

type AirQualitySeries = AirQualityHourly;

function sliceSeries(
  hourly: AirQualityHourly,
  count: number,
): AirQualitySeries {
  return {
    time: hourly.time.slice(0, count),
    pm10: hourly.pm10.slice(0, count),
    pm2_5: hourly.pm2_5.slice(0, count),
    nitrogen_dioxide: hourly.nitrogen_dioxide.slice(0, count),
    ozone: hourly.ozone.slice(0, count),
  };
}

export function getAirQualitySeries(
  hourly: AirQualityHourly | undefined,
  range: "24h" | "5d",
): AirQualitySeries | undefined {
  if (!hourly) return undefined;
  if (range === "24h") {
    return sliceSeries(hourly, 24);
  }
  return hourly;
}
