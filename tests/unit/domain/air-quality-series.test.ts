import { describe, expect, it } from "vitest";
import { getAirQualitySeries } from "@/lib/domain/air-quality-series";

describe("getAirQualitySeries", () => {
  it("returns first 24 entries for 24h", () => {
    const hourly = {
      time: Array.from({ length: 30 }, (_, i) => `t${i}`),
      pm10: Array.from({ length: 30 }, (_, i) => i),
      pm2_5: Array.from({ length: 30 }, (_, i) => i + 100),
      nitrogen_dioxide: Array.from({ length: 30 }, (_, i) => i + 200),
      ozone: Array.from({ length: 30 }, (_, i) => i + 300),
    };

    const series = getAirQualitySeries(hourly, "24h");
    expect(series?.time).toHaveLength(24);
    expect(series?.pm10[0]).toBe(0);
    expect(series?.pm10[23]).toBe(23);
  });

  it("returns full series for 5d", () => {
    const hourly = {
      time: Array.from({ length: 30 }, (_, i) => `t${i}`),
      pm10: Array.from({ length: 30 }, (_, i) => i),
      pm2_5: Array.from({ length: 30 }, (_, i) => i + 100),
      nitrogen_dioxide: Array.from({ length: 30 }, (_, i) => i + 200),
      ozone: Array.from({ length: 30 }, (_, i) => i + 300),
    };

    const series = getAirQualitySeries(hourly, "5d");
    expect(series?.time).toHaveLength(30);
  });
});
