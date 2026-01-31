export type WeatherCondition =
  | "clear"
  | "mostly-clear"
  | "partly-cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "rain-showers"
  | "snow-showers"
  | "thunderstorm"
  | "unknown";

export type WeatherIconKey =
  | "sun"
  | "cloud-sun"
  | "cloud"
  | "cloud-fog"
  | "cloud-drizzle"
  | "cloud-rain"
  | "cloud-snow"
  | "cloud-lightning"
  | "cloud-alert";

type WeatherClassification = {
  condition: WeatherCondition;
  label: string;
  iconKey: WeatherIconKey;
  background: string;
};

const weatherLabels: Record<WeatherCondition, string> = {
  clear: "快晴",
  "mostly-clear": "晴れ",
  "partly-cloudy": "薄曇り",
  overcast: "曇り",
  fog: "霧",
  drizzle: "霧雨",
  rain: "雨",
  snow: "雪",
  "rain-showers": "にわか雨",
  "snow-showers": "にわか雪",
  thunderstorm: "雷雨",
  unknown: "不明",
};

const weatherIcons: Record<WeatherCondition, WeatherIconKey> = {
  clear: "sun",
  "mostly-clear": "sun",
  "partly-cloudy": "cloud-sun",
  overcast: "cloud",
  fog: "cloud-fog",
  drizzle: "cloud-drizzle",
  rain: "cloud-rain",
  snow: "cloud-snow",
  "rain-showers": "cloud-rain",
  "snow-showers": "cloud-snow",
  thunderstorm: "cloud-lightning",
  unknown: "cloud-alert",
};

const weatherBackgrounds: Record<WeatherCondition, string> = {
  clear: "linear-gradient(to bottom, #87CEEB, #E0F6FF)",
  "mostly-clear": "linear-gradient(to bottom, #B0C4DE, #E8F4F8)",
  "partly-cloudy": "linear-gradient(to bottom, #A9C3D8, #E6F0F6)",
  overcast: "linear-gradient(to bottom, #778899, #D3D3D3)",
  fog: "linear-gradient(to bottom, #B0B8BF, #E1E5E8)",
  drizzle: "linear-gradient(to bottom, #7BA0C4, #C5D8E8)",
  rain: "linear-gradient(to bottom, #4682B4, #B0C4DE)",
  snow: "linear-gradient(to bottom, #E0FFFF, #FFFFFF)",
  "rain-showers": "linear-gradient(to bottom, #5A8DBB, #BCD0E4)",
  "snow-showers": "linear-gradient(to bottom, #E6F7FF, #FFFFFF)",
  thunderstorm: "linear-gradient(to bottom, #2F4F4F, #696969)",
  unknown: "linear-gradient(to bottom, #9CA3AF, #E5E7EB)",
};

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code === 1) return "mostly-clear";
  if (code === 2) return "partly-cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 55) return "drizzle";
  if (code >= 61 && code <= 65) return "rain";
  if (code >= 71 && code <= 75) return "snow";
  if (code >= 80 && code <= 82) return "rain-showers";
  if (code >= 85 && code <= 86) return "snow-showers";
  if (code >= 95 && code <= 99) return "thunderstorm";
  return "unknown";
}

export function getWeatherClassification(code: number): WeatherClassification {
  const condition = getWeatherCondition(code);
  return {
    condition,
    label: weatherLabels[condition],
    iconKey: weatherIcons[condition],
    background: weatherBackgrounds[condition],
  };
}

export function getWeatherLabel(code: number): string {
  return weatherLabels[getWeatherCondition(code)];
}

export function getWeatherIconKey(code: number): string {
  return weatherIcons[getWeatherCondition(code)];
}

export function getWeatherBackground(code: number): string {
  return weatherBackgrounds[getWeatherCondition(code)];
}
