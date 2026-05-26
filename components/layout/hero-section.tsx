import { WeatherIcon } from "@/features/weather/ui/weather-icon";
import { RealtimeClock } from "@/components/ui/realtime-clock";
import type { WeatherIconKey } from "@/lib/domain/weather-classification";

type WeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
};

type WeatherClassification = {
  iconKey: WeatherIconKey;
  label: string;
  badgeColor?: string;
};

type HeroSectionProps = {
  snapshot: WeatherSnapshot;
  weatherClassification?: WeatherClassification;
  timeZone: string;
  isLoading: boolean;
};

export function HeroSection({
  snapshot,
  weatherClassification,
  timeZone,
  isLoading,
}: HeroSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 w-64 animate-pulse rounded-2xl bg-muted/30" />
        <div className="h-6 w-48 animate-pulse rounded-md bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-end gap-5">
        <div className="font-mono text-[7rem] font-semibold leading-none tracking-[-4px] text-foreground [font-feature-settings:'tnum']">
          {Math.round(snapshot.temperature)}
          <span className="text-[2rem] font-normal tracking-normal text-foreground/60">
            ℃
          </span>
        </div>
        <div className="mb-3 flex flex-col gap-1">
          {weatherClassification ? (
            <>
              <WeatherIcon
                iconKey={weatherClassification.iconKey}
                label={weatherClassification.label}
                className="h-14 w-14 text-foreground/70"
              />
              <span
                className="mt-1 text-lg font-medium"
                style={{
                  color: weatherClassification.badgeColor ?? undefined,
                }}
              >
                {weatherClassification.label}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <div className="mb-3 flex flex-col items-start gap-2 lg:items-end">
        <div className="text-sm text-muted-foreground">
          体感{" "}
          <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
            {Math.round(snapshot.apparentTemperature)}℃
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>
            湿度{" "}
            <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
              {Math.round(snapshot.humidity)}%
            </span>
          </span>
          <span className="text-foreground/20">·</span>
          <span>
            風速{" "}
            <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
              {snapshot.windSpeed.toFixed(1)} m/s
            </span>
          </span>
          <span className="text-foreground/20">·</span>
          <span>
            降水{" "}
            <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
              {Math.round(snapshot.precipitationProbability)}%
            </span>
          </span>
        </div>
        <RealtimeClock timeZone={timeZone} />
      </div>
    </div>
  );
}
