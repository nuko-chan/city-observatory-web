"use client";

import { useMemo, useState } from "react";
import { WeatherCard } from "@/features/weather/ui/weather-card";
import { WeatherChart } from "@/features/weather/ui/weather-chart";
import { AirQualityCard } from "@/features/air-quality/ui/aq-card";
import { AQChart } from "@/features/air-quality/ui/aq-chart";
import { MapView } from "@/features/map/ui/map-view";
import { MapOverlayToggle } from "@/features/map/ui/map-overlay-toggle";
import { useWeatherData } from "@/features/weather/model/use-weather-data";
import { useAirQualityData } from "@/features/air-quality/model/use-air-quality-data";
import type { Location } from "@/lib/types/location";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

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

export default function Home() {
  const [selectedCityId, setSelectedCityId] = useState<number>(cities[0].id);
  const [weatherRange, setWeatherRange] = useState<"24h" | "7d">("24h");
  const [airRange, setAirRange] = useState<"24h" | "5d">("24h");
  const [mapOverlay, setMapOverlay] = useState<"none" | "precipitation">(
    "none",
  );
  const { theme, setTheme } = useTheme();

  const activeCity =
    cities.find((city) => city.id === selectedCityId) ?? cities[0];

  const weatherQuery = useWeatherData(activeCity, weatherRange);
  const airQuery = useAirQualityData(activeCity, airRange);

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
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 lg:flex-row lg:gap-8 lg:px-6 lg:py-6">
        <aside className="w-full rounded-3xl border bg-background p-4 shadow-sm lg:w-64 lg:shrink-0 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              City Observatory
            </div>
            <button
              type="button"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
              aria-label="ダークモード切替"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:mt-6 lg:flex-col lg:overflow-visible lg:pb-0">
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCityId(city.id)}
                className={cn(
                  "flex min-w-[132px] flex-1 items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition lg:w-full lg:min-w-0",
                  selectedCityId === city.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-transparent hover:border-foreground/30",
                )}
              >
                <span className="font-medium">{city.label}</span>
                <span className="text-xs text-muted-foreground">
                  {city.name}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 hidden rounded-2xl border bg-muted/30 p-4 text-xs text-muted-foreground lg:block">
            <div className="text-sm font-semibold text-foreground">
              nuko-chan
            </div>
            <p className="mt-2 leading-relaxed">
              Webアプリ開発（TypeScript / React / Next.js / Node.js）
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                className="underline-offset-4 hover:underline"
                href="https://x.com/nukochan_123"
                target="_blank"
                rel="noopener noreferrer"
              >
                X: @nukochan_123
              </a>
              <a
                className="underline-offset-4 hover:underline"
                href="https://nuko-chan.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog: nuko-chan.pages.dev
              </a>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-3xl border bg-background p-5 shadow-sm lg:p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Dashboard
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl font-semibold text-foreground">
                {activeCity.label}
              </h1>
              <span className="text-sm text-muted-foreground">
                {activeCity.country}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatLocalTime(activeCity.timezone)}（現地時刻）
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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
              {weatherQuery.data?.hourly && weatherRange === "24h" && (
                <WeatherChart
                  title="気温の推移"
                  range="24h"
                  data={weatherQuery.data.hourly}
                  dataKey="temperature_2m"
                  timeZone={weatherQuery.data.timezone}
                  onRangeChange={setWeatherRange}
                />
              )}
              {weatherQuery.data?.daily && weatherRange === "7d" && (
                <WeatherChart
                  title="気温の推移"
                  range="7d"
                  data={weatherQuery.data.daily}
                  dataKey="temperature_2m_max"
                  timeZone={weatherQuery.data.timezone}
                  onRangeChange={setWeatherRange}
                />
              )}
              {!weatherQuery.data?.hourly && !weatherQuery.data?.daily && (
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

            <section className="relative h-[320px] overflow-hidden rounded-3xl border bg-background p-3 shadow-sm md:h-[420px] xl:h-auto xl:p-4">
              <div className="absolute left-6 top-6 z-10">
                <MapOverlayToggle value={mapOverlay} onChange={setMapOverlay} />
              </div>
              <MapView
                center={[activeCity.lon, activeCity.lat]}
                zoom={10}
                markers={[
                  {
                    lng: activeCity.lon,
                    lat: activeCity.lat,
                    label: activeCity.label,
                  },
                ]}
                overlay={mapOverlay}
              />
            </section>
          </div>
          <footer className="rounded-3xl border bg-background px-6 py-4 text-xs text-muted-foreground shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>Weather data by Open-Meteo.com</span>
              <div className="flex flex-wrap gap-3">
                <a
                  className="underline-offset-4 hover:underline"
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open-Meteo
                </a>
                <a
                  className="underline-offset-4 hover:underline"
                  href="https://www.maptiler.com/copyright/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MapTiler
                </a>
                <a
                  className="underline-offset-4 hover:underline"
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenStreetMap
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
