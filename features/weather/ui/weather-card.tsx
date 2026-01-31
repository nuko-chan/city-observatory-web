import type { ReactNode } from "react";

type WeatherCardProps = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  icon?: ReactNode;
  isLoading?: boolean;
};

export function WeatherCard({
  temperature,
  apparentTemperature,
  humidity,
  windSpeed,
  precipitationProbability,
  icon,
  isLoading = false,
}: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
        <div className="mt-4 h-10 w-32 animate-pulse rounded-md bg-muted" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>現在の天気</span>
        {icon}
      </div>
      <div className="mt-3 text-4xl font-semibold">
        {Math.round(temperature)}℃
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        体感 {Math.round(apparentTemperature)}℃
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>湿度</span>
          <span className="text-foreground">{Math.round(humidity)}%</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>風速</span>
          <span className="text-foreground">{windSpeed.toFixed(1)} m/s</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>降水確率</span>
          <span className="text-foreground">
            {Math.round(precipitationProbability)}%
          </span>
        </div>
      </div>
    </div>
  );
}
