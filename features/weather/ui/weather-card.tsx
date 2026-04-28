import type { ReactNode } from "react";

type WeatherCardProps = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  icon?: ReactNode;
  conditionLabel?: string;
  isLoading?: boolean;
};

export function WeatherCard({
  temperature,
  apparentTemperature,
  humidity,
  windSpeed,
  precipitationProbability,
  icon,
  conditionLabel,
  isLoading = false,
}: WeatherCardProps) {
  if (isLoading) {
    return (
      <div>
        <div className="h-6 w-24 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-4 h-10 w-32 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-5 w-full animate-pulse rounded-md bg-muted/50" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted/50" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted/50" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted/50" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
            Temperature
          </span>
          {conditionLabel ? (
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium uppercase tracking-[0.2px]">
              {conditionLabel}
            </span>
          ) : null}
        </div>
        {icon}
      </div>
      <div className="mt-3 font-mono text-5xl font-semibold tracking-[-0.5px] [font-feature-settings:'tnum']">
        {Math.round(temperature)}
        <span className="font-mono text-sm font-normal">℃</span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        体感{" "}
        <span className="font-mono [font-feature-settings:'tnum']">
          {Math.round(apparentTemperature)}
        </span>
        ℃
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium uppercase tracking-[0.2px]">
            湿度
          </span>
          <span className="font-mono text-sm font-semibold text-foreground [font-feature-settings:'tnum']">
            {Math.round(humidity)}
            <span className="font-mono text-xs font-normal">%</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium uppercase tracking-[0.2px]">
            風速
          </span>
          <span className="font-mono text-sm font-semibold text-foreground [font-feature-settings:'tnum']">
            {windSpeed.toFixed(1)}
            <span className="font-mono text-xs font-normal"> m/s</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium uppercase tracking-[0.2px]">
            降水確率
          </span>
          <span className="font-mono text-sm font-semibold text-foreground [font-feature-settings:'tnum']">
            {Math.round(precipitationProbability)}
            <span className="font-mono text-xs font-normal">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
