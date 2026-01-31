export type TimeSlot = {
  startTime: string;
  endTime: string;
  score: number;
};

export type DerivedMetrics = {
  comfortScore: number;
  outdoorRiskLevel: "low" | "medium" | "high";
  bestTimeSlots: TimeSlot[];
  airQualityLabel: "good" | "moderate" | "unhealthy" | "hazardous";
};
