"use client";

import { useMemo, useState } from "react";
import { WeatherCard } from "@/features/weather/ui/weather-card";
import { AQChart } from "@/features/air-quality/ui/aq-chart";
import { useWeatherData } from "@/features/weather/model/use-weather-data";
import { useAirQualityData } from "@/features/air-quality/model/use-air-quality-data";
import type { Location } from "@/lib/types/location";
import { cn } from "@/lib/utils";

const cities: Array<Location & { label: string }> = [
  {
    id: 1850144,
    name: "Tokyo",
    label: "東京",
    country: "Japan",
    lat: 35.6895,
    lon: 139.6917,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1853909,
    name: "Osaka",
    label: "大阪",
    country: "Japan",
    lat: 34.6937,
    lon: 135.5023,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1856057,
    name: "Nagoya",
    label: "名古屋",
    country: "Japan",
    lat: 35.1815,
    lon: 136.9066,
    timezone: "Asia/Tokyo",
  },
  {
    id: 2128295,
    name: "Sapporo",
    label: "札幌",
    country: "Japan",
    lat: 43.0618,
    lon: 141.3545,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1863967,
    name: "Fukuoka",
    label: "福岡",
    country: "Japan",
    lat: 33.5904,
    lon: 130.4017,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1856035,
    name: "Naha",
    label: "那覇",
    country: "Japan",
    lat: 26.2124,
    lon: 127.6809,
    timezone: "Asia/Tokyo",
  },
];

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

export default function ComparePage() {
  const [leftCityId, setLeftCityId] = useState<number>(cities[0].id);
  const [rightCityId, setRightCityId] = useState<number>(cities[1].id);

  const leftCity = cities.find((city) => city.id === leftCityId) ?? cities[0];
  const rightCity = cities.find((city) => city.id === rightCityId) ?? cities[1];

  const leftWeather = useWeatherData(leftCity, "24h");
  const rightWeather = useWeatherData(rightCity, "24h");
  const leftAir = useAirQualityData(leftCity, "24h");
  const rightAir = useAirQualityData(rightCity, "24h");

  const leftSnapshot = useMemo(() => {
    if (!leftWeather.data?.hourly) return undefined;
    const index = findClosestIndex(leftWeather.data.hourly.time);
    return {
      temperature: leftWeather.data.hourly.temperature_2m[index],
      apparentTemperature: leftWeather.data.hourly.apparent_temperature[index],
      humidity: leftWeather.data.hourly.relative_humidity_2m[index],
      windSpeed: leftWeather.data.hourly.wind_speed_10m[index],
      precipitationProbability:
        leftWeather.data.hourly.precipitation_probability[index],
    };
  }, [leftWeather.data]);

  const rightSnapshot = useMemo(() => {
    if (!rightWeather.data?.hourly) return undefined;
    const index = findClosestIndex(rightWeather.data.hourly.time);
    return {
      temperature: rightWeather.data.hourly.temperature_2m[index],
      apparentTemperature: rightWeather.data.hourly.apparent_temperature[index],
      humidity: rightWeather.data.hourly.relative_humidity_2m[index],
      windSpeed: rightWeather.data.hourly.wind_speed_10m[index],
      precipitationProbability:
        rightWeather.data.hourly.precipitation_probability[index],
    };
  }, [rightWeather.data]);

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-3xl border bg-background p-5 shadow-sm lg:p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Compare Mode
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-semibold text-foreground">都市比較</h1>
            <span className="text-sm text-muted-foreground">
              2都市の現在値を並べて確認
            </span>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border bg-background p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              左の都市
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setLeftCityId(city.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    leftCityId === city.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:border-foreground/30",
                  )}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border bg-background p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              右の都市
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setRightCityId(city.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    rightCityId === city.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:border-foreground/30",
                  )}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-semibold text-foreground">
                {leftCity.label}
              </h2>
              <span className="text-xs text-muted-foreground">
                {formatLocalTime(leftCity.timezone)}
              </span>
            </div>
            <WeatherCard
              temperature={leftSnapshot?.temperature ?? 0}
              apparentTemperature={leftSnapshot?.apparentTemperature ?? 0}
              humidity={leftSnapshot?.humidity ?? 0}
              windSpeed={leftSnapshot?.windSpeed ?? 0}
              precipitationProbability={
                leftSnapshot?.precipitationProbability ?? 0
              }
              isLoading={leftWeather.isLoading}
            />
            {leftAir.data?.hourly ? (
              <AQChart
                title="PM2.5 推移"
                data={leftAir.data.hourly}
                dataKey="pm2_5"
                range="24h"
                timeZone={leftAir.data.timezone}
              />
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-2xl border bg-muted/30" />
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-semibold text-foreground">
                {rightCity.label}
              </h2>
              <span className="text-xs text-muted-foreground">
                {formatLocalTime(rightCity.timezone)}
              </span>
            </div>
            <WeatherCard
              temperature={rightSnapshot?.temperature ?? 0}
              apparentTemperature={rightSnapshot?.apparentTemperature ?? 0}
              humidity={rightSnapshot?.humidity ?? 0}
              windSpeed={rightSnapshot?.windSpeed ?? 0}
              precipitationProbability={
                rightSnapshot?.precipitationProbability ?? 0
              }
              isLoading={rightWeather.isLoading}
            />
            {rightAir.data?.hourly ? (
              <AQChart
                title="PM2.5 推移"
                data={rightAir.data.hourly}
                dataKey="pm2_5"
                range="24h"
                timeZone={rightAir.data.timezone}
              />
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-2xl border bg-muted/30" />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
