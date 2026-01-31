import { describe, expect, it } from "vitest";
import { calculateOutdoorRisk } from "@/lib/domain/outdoor-risk";

describe("calculateOutdoorRisk", () => {
  it("returns low for calm conditions", () => {
    const risk = calculateOutdoorRisk({
      precipitationProbability: 5,
      windSpeed: 1,
      pm25: 5,
    });
    expect(risk).toBe("low");
  });

  it("returns high for severe conditions", () => {
    const risk = calculateOutdoorRisk({
      precipitationProbability: 90,
      windSpeed: 15,
      pm25: 80,
    });
    expect(risk).toBe("high");
  });
});
