type ComfortScoreInput = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  pm25: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// 推測: 東京の体感に寄せた簡易スコア（0-100）
export function calculateComfortScore(input: ComfortScoreInput) {
  const temperaturePenalty = Math.abs(input.temperature - 22) * 2.2;
  const humidityPenalty = Math.abs(input.humidity - 50) * 0.6;
  const windPenalty = Math.max(input.windSpeed - 3, 0) * 4;
  const rainPenalty = input.precipitationProbability * 0.15;
  const airPenalty = Math.max(input.pm25 - 12, 0) * 0.6;

  const score =
    100 -
    temperaturePenalty -
    humidityPenalty -
    windPenalty -
    rainPenalty -
    airPenalty;

  return clamp(Math.round(score), 0, 100);
}
