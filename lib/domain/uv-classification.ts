export type UVLevel = "low" | "moderate" | "high" | "very-high" | "extreme";

export type UVClassification = {
  level: UVLevel;
  label: string;
  color: string;
};

const uvLabels: Record<UVLevel, string> = {
  low: "低い",
  moderate: "中程度",
  high: "高い",
  "very-high": "非常に高い",
  extreme: "極端に高い",
};

// Environmental Semantic Colors (DESIGN.md)
const uvColors: Record<UVLevel, string> = {
  low: "oklch(0.72 0.14 180)",
  moderate: "oklch(0.80 0.16 85)",
  high: "oklch(0.72 0.19 55)",
  "very-high": "oklch(0.62 0.24 25)",
  extreme: "oklch(0.62 0.24 25)",
};

export function classifyUVIndex(index: number): UVLevel {
  // 国際的に一般的なUV Indexの区分（0-2/3-5/6-7/8-10/11+）
  if (index <= 2) return "low";
  if (index <= 5) return "moderate";
  if (index <= 7) return "high";
  if (index <= 10) return "very-high";
  return "extreme";
}

export function getUVClassification(index: number): UVClassification {
  const level = classifyUVIndex(index);
  return {
    level,
    label: uvLabels[level],
    color: uvColors[level],
  };
}

export function getUVLabel(index: number): string {
  return uvLabels[classifyUVIndex(index)];
}
