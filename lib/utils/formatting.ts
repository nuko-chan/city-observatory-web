export function formatLocalTime(timeZone: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export type TemperatureColor = {
  hue: number;
  saturation: string;
};

export function temperatureToColor(temp: number): TemperatureColor {
  if (temp < 5) return { hue: 210, saturation: "90%" };
  if (temp < 10) return { hue: 200, saturation: "85%" };
  if (temp < 15) return { hue: 190, saturation: "80%" };
  if (temp < 20) return { hue: 160, saturation: "75%" };
  if (temp < 25) return { hue: 50, saturation: "80%" };
  if (temp < 30) return { hue: 35, saturation: "85%" };
  return { hue: 15, saturation: "90%" };
}

export function temperatureHsl(
  color: TemperatureColor,
  lightness: string,
): string {
  return `hsl(${color.hue}, ${color.saturation}, ${lightness})`;
}
