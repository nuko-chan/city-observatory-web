"use client";

import { useMemo, useState } from "react";
import { WeatherCard } from "@/features/weather/ui/weather-card";
import { WeatherChart } from "@/features/weather/ui/weather-chart";
import { AirQualityCard } from "@/features/air-quality/ui/aq-card";
import { AQChart } from "@/features/air-quality/ui/aq-chart";
import { MapView } from "@/features/map/ui/map-view";
import { useWeatherData } from "@/features/weather/model/use-weather-data";
import { useAirQualityData } from "@/features/air-quality/model/use-air-quality-data";
import type { Location } from "@/lib/types/location";

const defaultLocation: Location = {
  id: 1850144,
  name: "Tokyo",
  country: "Japan",
  lat: 35.6895,
  lon: 139.6917,
  timezone: "Asia/Tokyo",
};

function findClosestIndex(times: string[]) {
  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const value = new Date(time).getTime();
    const diff = Math.abs(value - now);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function formatLocalTime(timeZone: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export default function DashboardPage() {
  const [weatherRange, setWeatherRange] = useState<"24h" | "7d">("24h");
  const [airRange, setAirRange] = useState<"24h" | "5d">("24h");

  const weatherQuery = useWeatherData(defaultLocation, weatherRange);
  const airQuery = useAirQualityData(defaultLocation, airRange);

  const weatherSnapshot = useMemo(() => {
    if (!weatherQuery.data?.hourly) return undefined;
    const index = findClosestIndex(weatherQuery.data.hourly.time);
    return {
      temperature: weatherQuery.data.hourly.temperature_2m[index],
      apparentTemperature: weatherQuery.data.hourly.apparent_temperature[index],
      humidity: weatherQuery.data.hourly.relative_humidity_2m[index],
      windSpeed: weatherQuery.data.hourly.wind_speed_10m[index],
      precipitationProbability:
        weatherQuery.data.hourly.precipitation_probability[index],
    };
  }, [weatherQuery.data]);

  const airSnapshot = useMemo(() => {
    if (!airQuery.data?.hourly) return undefined;
    const index = findClosestIndex(airQuery.data.hourly.time);
    return {
      pm25: airQuery.data.hourly.pm2_5[index],
      pm10: airQuery.data.hourly.pm10[index],
      nitrogenDioxide: airQuery.data.hourly.nitrogen_dioxide[index],
      ozone: airQuery.data.hourly.ozone[index],
    };
  }, [airQuery.data]);

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            City Dashboard
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-semibold text-foreground">
              {defaultLocation.name}
            </h1>
            <span className="text-sm text-muted-foreground">
              {defaultLocation.country}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatLocalTime(defaultLocation.timezone)}（現地時刻）
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col gap-6">
            <WeatherCard
              temperature={weatherSnapshot?.temperature ?? 0}
              apparentTemperature={weatherSnapshot?.apparentTemperature ?? 0}
              humidity={weatherSnapshot?.humidity ?? 0}
              windSpeed={weatherSnapshot?.windSpeed ?? 0}
              precipitationProbability={
                weatherSnapshot?.precipitationProbability ?? 0
              }
              isLoading={weatherQuery.isLoading}
            />
            {weatherQuery.data?.[
              weatherRange === "24h" ? "hourly" : "daily"
            ] ? (
              <WeatherChart
                title="気温の推移"
                range={weatherRange}
                data={
                  weatherRange === "24h"
                    ? weatherQuery.data.hourly!
                    : weatherQuery.data.daily!
                }
                dataKey={
                  weatherRange === "24h"
                    ? "temperature_2m"
                    : "temperature_2m_max"
                }
                timeZone={weatherQuery.data.timezone}
                onRangeChange={setWeatherRange}
              />
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-2xl border bg-muted/30" />
            )}

            <AirQualityCard
              pm25={airSnapshot?.pm25 ?? 0}
              pm10={airSnapshot?.pm10 ?? 0}
              nitrogenDioxide={airSnapshot?.nitrogenDioxide ?? 0}
              ozone={airSnapshot?.ozone ?? 0}
              isLoading={airQuery.isLoading}
            />
            {airQuery.data?.hourly ? (
              <AQChart
                title="PM2.5 推移"
                data={airQuery.data.hourly}
                dataKey="pm2_5"
                range={airRange}
                timeZone={airQuery.data.timezone}
                onRangeChange={setAirRange}
              />
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-2xl border bg-muted/30" />
            )}
          </section>

          <section className="h-[420px] lg:h-auto">
            <MapView
              center={[defaultLocation.lon, defaultLocation.lat]}
              zoom={10}
              markers={[
                {
                  lng: defaultLocation.lon,
                  lat: defaultLocation.lat,
                  label: defaultLocation.name,
                },
              ]}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
