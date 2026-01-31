import { describe, expect, it } from "vitest";
import { classifyAirQualityLabel } from "@/lib/domain/air-quality-label";

describe("classifyAirQualityLabel", () => {
  it("returns good for low pm2.5", () => {
    expect(classifyAirQualityLabel(10)).toBe("good");
  });

  it("returns hazardous for high pm2.5", () => {
    expect(classifyAirQualityLabel(120)).toBe("hazardous");
  });
});
