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

const uvColors: Record<UVLevel, string> = {
  low: "hsl(120, 60%, 50%)",
  moderate: "hsl(60, 100%, 50%)",
  high: "hsl(30, 100%, 50%)",
  "very-high": "hsl(0, 100%, 50%)",
  extreme: "hsl(270, 100%, 40%)",
};

export function classifyUVIndex(index: number): UVLevel {
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
