export function formatLocalTime(timeZone: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

// 気温から色を生成（データドリブン）
export function temperatureToColor(temp: number): string {
  if (temp < 5) return "210, 90%"; // 青
  if (temp < 10) return "200, 85%";
  if (temp < 15) return "190, 80%"; // シアン
  if (temp < 20) return "160, 75%"; // 緑がかった
  if (temp < 25) return "50, 80%"; // 黄色
  if (temp < 30) return "35, 85%"; // オレンジ
  return "15, 90%"; // 赤
}
