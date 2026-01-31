import { describe, expect, it } from "vitest";
import { getAirQualitySnapshot } from "@/lib/domain/air-quality-snapshot";

describe("getAirQualitySnapshot", () => {
  it("returns undefined when hourly is missing", () => {
    expect(getAirQualitySnapshot(undefined)).toBeUndefined();
  });

  it("returns nearest snapshot by time", () => {
    const snapshot = getAirQualitySnapshot(
      {
        time: ["2026-01-01T00:00:00", "2026-01-01T01:00:00"],
        pm10: [10, 20],
        pm2_5: [5, 15],
        nitrogen_dioxide: [30, 40],
        ozone: [50, 60],
      },
      new Date("2026-01-01T01:05:00Z").getTime(),
    );

    expect(snapshot).toEqual({
      pm25: 15,
      pm10: 20,
      nitrogenDioxide: 40,
      ozone: 60,
    });
  });
});
