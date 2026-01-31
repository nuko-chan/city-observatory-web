"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WeatherCard } from "@/features/weather/ui/weather-card";
import { WeatherChart } from "@/features/weather/ui/weather-chart";
import { AQChart } from "@/features/air-quality/ui/aq-chart";
import { MapView } from "@/features/map/ui/map-view";
import { MapOverlayToggle } from "@/features/map/ui/map-overlay-toggle";
import { useWeatherData } from "@/features/weather/model/use-weather-data";
import { useWeatherSnapshot } from "@/features/weather/model/use-weather-snapshot";
import { WeatherIcon } from "@/features/weather/ui/weather-icon";
import { UVCard } from "@/features/weather/ui/uv-card";
import { WindCard } from "@/features/weather/ui/wind-card";
import { SunPathCard } from "@/features/weather/ui/sun-path-card";
import { useAirQualityData } from "@/features/air-quality/model/use-air-quality-data";
import { getAirQualitySeries } from "@/lib/domain/air-quality-series";
import { cities } from "@/lib/constants/cities";
import { cn } from "@/lib/utils";
import { formatLocalTime, temperatureToColor } from "@/lib/utils/formatting";

const defaultCityId = cities[0].id;

export default function Home() {
  const [selectedCityId, setSelectedCityId] = useState<number>(defaultCityId);
  const [mapOverlay, setMapOverlay] = useState<"none" | "precipitation">(
    "none",
  );

  const activeCity =
    cities.find((city) => city.id === selectedCityId) ?? cities[0];

  const weatherQuery = useWeatherData(activeCity, "24h");
  const airQuery = useAirQualityData(activeCity, "24h");
  const weatherView = useWeatherSnapshot({
    hourly: weatherQuery.data?.hourly,
    daily: weatherQuery.data?.daily,
    timeZone: weatherQuery.data?.timezone ?? activeCity.timezone,
  });

  const airSeries = useMemo(
    () => getAirQualitySeries(airQuery.data?.hourly, "24h"),
    [airQuery.data],
  );

  // 背景色をデータから生成
  const bgColor = temperatureToColor(weatherView?.snapshot.temperature ?? 20);
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* データドリブンな背景グラデーション */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, hsl(${bgColor}, 45%) 0%, hsl(${bgColor}, 25%) 30%, transparent 65%)`,
          }}
        />
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>

      <div className="mx-auto min-h-screen w-full px-6 py-8 lg:px-12 lg:py-12">
        {/* ヘッダー */}
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
              City Observatory
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              {activeCity.label}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatLocalTime(activeCity.timezone)} 現地時刻
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/50 px-6 py-3 text-sm font-medium backdrop-blur-xl transition-all duration-300 hover:border-foreground/30 hover:bg-background/60 hover:shadow-lg hover:scale-105"
            >
              都市を比較 →
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/50 px-6 py-3 text-sm font-medium backdrop-blur-xl transition-all duration-300 hover:border-foreground/30 hover:bg-background/60 hover:shadow-lg hover:scale-105"
            >
              About
            </Link>
          </div>
        </header>

        {/* 都市選択 */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
          <div className="rounded-2xl border border-foreground/10 bg-background/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/50 hover:shadow-lg">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Select City
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setSelectedCityId(city.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105",
                    selectedCityId === city.id
                      ? "border-foreground/30 bg-foreground/10 text-foreground shadow-lg"
                      : "border-transparent text-muted-foreground hover:border-foreground/20 hover:bg-foreground/5",
                  )}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid min-h-[calc(100vh-16rem)] gap-8 lg:grid-cols-2">
          {/* 左カラム: データカード */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
            {/* 天気カード */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <WeatherCard
                temperature={weatherView?.snapshot.temperature ?? 0}
                apparentTemperature={
                  weatherView?.snapshot.apparentTemperature ?? 0
                }
                humidity={weatherView?.snapshot.humidity ?? 0}
                windSpeed={weatherView?.snapshot.windSpeed ?? 0}
                precipitationProbability={
                  weatherView?.snapshot.precipitationProbability ?? 0
                }
                icon={
                  weatherView?.weatherClassification ? (
                    <WeatherIcon
                      iconKey={weatherView.weatherClassification.iconKey}
                      label={weatherView.weatherClassification.label}
                      className="h-5 w-5"
                    />
                  ) : undefined
                }
                conditionLabel={weatherView?.weatherClassification.label}
                isLoading={weatherQuery.isLoading}
              />
            </div>

            {/* UV指数 */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <UVCard
                uvIndex={weatherView?.snapshot.uvIndex ?? 0}
                uvIndexMax={weatherView?.uvIndexMax}
                label={weatherView?.uvClassification.label ?? "不明"}
                color={weatherView?.uvClassification.color ?? "hsl(0, 0%, 60%)"}
                isLoading={weatherQuery.isLoading}
              />
            </div>

            {/* 風向き・風速 */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <WindCard
                windSpeed={weatherView?.snapshot.windSpeed ?? 0}
                windDirection={weatherView?.windDirectionRotation ?? 0}
                directionLabel={weatherView?.windDirectionLabel ?? "不明"}
                isLoading={weatherQuery.isLoading}
              />
            </div>

            {/* 日の出/日の入り */}
            {weatherView?.sunriseAt && weatherView.sunsetAt ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <SunPathCard
                  sunrise={new Date(weatherView.sunriseAt).toLocaleTimeString(
                    "ja-JP",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                  sunset={new Date(weatherView.sunsetAt).toLocaleTimeString(
                    "ja-JP",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                  nowLabel={formatLocalTime(activeCity.timezone)}
                  phaseLabel={weatherView.sunPhaseLabel}
                  progress={weatherView.sunProgress}
                  background={weatherView.sunPhaseBackground}
                  isLoading={weatherQuery.isLoading}
                />
              </div>
            ) : null}

            {/* 気温の推移 */}
            {weatherQuery.data?.hourly ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <WeatherChart
                  title="気温の推移"
                  range="24h"
                  data={weatherQuery.data.hourly}
                  dataKey="temperature_2m"
                  timeZone={weatherQuery.data.timezone}
                />
              </div>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-3xl border border-foreground/10 bg-muted/30 backdrop-blur-2xl" />
            )}

            {/* PM2.5グラフ */}
            {airSeries && !airQuery.isFetching ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <AQChart
                  title="PM2.5 推移"
                  data={airSeries}
                  dataKey="pm2_5"
                  range="24h"
                  timeZone={airQuery.data?.timezone ?? activeCity.timezone}
                />
              </div>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-3xl border border-foreground/10 bg-muted/30 backdrop-blur-2xl" />
            )}
          </div>

          {/* 右カラム: 地図 */}
          <div className="flex animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
            <div className="sticky top-8 h-full w-full overflow-hidden rounded-3xl border border-foreground/10 bg-background/50 p-4 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
              <div className="absolute left-8 top-8 z-10">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
