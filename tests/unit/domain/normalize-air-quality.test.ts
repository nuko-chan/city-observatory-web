import { describe, expect, it } from "vitest";
import { normalizeAirQualityResponse } from "@/lib/domain/normalize-air-quality";

describe("normalizeAirQualityResponse", () => {
  it("drops trailing null values", () => {
    const raw = {
      latitude: 35.6,
      longitude: 139.6,
      timezone: "Asia/Tokyo",
      utc_offset_seconds: 32400,
      hourly: {
        time: ["t0", "t1", "t2"],
        pm10: [10, 11, null],
        pm2_5: [1, 2, null],
        nitrogen_dioxide: [20, 21, null],
        ozone: [30, 31, null],
      },
    };

    const normalized = normalizeAirQualityResponse(raw);

    expect(normalized.hourly.time).toEqual(["t0", "t1"]);
    expect(normalized.hourly.pm10).toEqual([10, 11]);
  });

  it("removes indexes that contain nulls", () => {
    const raw = {
      latitude: 35.6,
      longitude: 139.6,
      timezone: "Asia/Tokyo",
      utc_offset_seconds: 32400,
      hourly: {
        time: ["t0", "t1", "t2", "t3"],
        pm10: [10, null, 12, 13],
        pm2_5: [1, null, 3, 4],
        nitrogen_dioxide: [20, null, 22, 23],
        ozone: [30, null, 32, 33],
      },
    };

    const normalized = normalizeAirQualityResponse(raw);

    expect(normalized.hourly.time).toEqual(["t0", "t2", "t3"]);
    expect(normalized.hourly.pm2_5).toEqual([1, 3, 4]);
  });
});
