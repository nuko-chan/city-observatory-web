type TimeSlot = {
  startTime: string;
  endTime: string;
  score: number;
};

// 推測: 上位スコアの時間帯を抽出（重複を避ける）
export function findBestTimeSlots(
  times: string[],
  scores: number[],
  limit = 3,
): TimeSlot[] {
  const entries = times.map((time, index) => ({
    time,
    score: scores[index] ?? 0,
  }));

  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const result: TimeSlot[] = [];

  for (const entry of sorted) {
    if (result.length >= limit) break;
    const startTime = entry.time;
    const endTime = new Date(
      new Date(entry.time).getTime() + 60 * 60 * 1000,
    ).toISOString();
    result.push({ startTime, endTime, score: entry.score });
  }

  return result;
}
