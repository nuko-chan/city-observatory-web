import { describe, expect, it } from "vitest";
import { calculateComfortScore } from "@/lib/domain/comfort-score";

describe("calculateComfortScore", () => {
  it("returns higher score for mild conditions", () => {
    const score = calculateComfortScore({
      temperature: 22,
      humidity: 50,
      windSpeed: 2,
      precipitationProbability: 10,
      pm25: 8,
    });
    expect(score).toBeGreaterThan(70);
  });

  it("returns lower score for harsh conditions", () => {
    const score = calculateComfortScore({
      temperature: 35,
      humidity: 85,
      windSpeed: 10,
      precipitationProbability: 80,
      pm25: 60,
    });
    expect(score).toBeLessThan(40);
  });
});
