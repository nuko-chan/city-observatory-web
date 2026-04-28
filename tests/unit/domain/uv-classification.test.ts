import { describe, expect, it } from "vitest";
import {
  classifyUVIndex,
  getUVClassification,
} from "@/lib/domain/uv-classification";

describe("classifyUVIndex", () => {
  it("classifies low range", () => {
    expect(classifyUVIndex(0)).toBe("low");
    expect(classifyUVIndex(2)).toBe("low");
  });

  it("classifies moderate range", () => {
    expect(classifyUVIndex(3)).toBe("moderate");
    expect(classifyUVIndex(5)).toBe("moderate");
  });

  it("classifies high range", () => {
    expect(classifyUVIndex(6)).toBe("high");
    expect(classifyUVIndex(7)).toBe("high");
  });

  it("classifies very-high range", () => {
    expect(classifyUVIndex(8)).toBe("very-high");
    expect(classifyUVIndex(10)).toBe("very-high");
  });

  it("classifies extreme range", () => {
    expect(classifyUVIndex(11)).toBe("extreme");
    expect(classifyUVIndex(20)).toBe("extreme");
  });
});

describe("getUVClassification", () => {
  it("returns label and color", () => {
    const classification = getUVClassification(6.5);
    expect(classification.label).toBe("高い");
    expect(classification.color).toContain("oklch");
  });
});
