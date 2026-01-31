"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WeatherCard } from "@/features/weather/ui/weather-card";
import { WeatherChart } from "@/features/weather/ui/weather-chart";
import { AQChart } from "@/features/air-quality/ui/aq-chart";
import { MapView } from "@/features/map/ui/map-view";
import { useWeatherData } from "@/features/weather/model/use-weather-data";
import { useWeatherSnapshot } from "@/features/weather/model/use-weather-snapshot";
import { WeatherIcon } from "@/features/weather/ui/weather-icon";
import { UVCard } from "@/features/weather/ui/uv-card";
import { WindCard } from "@/features/weather/ui/wind-card";
import { SunPathCard } from "@/features/weather/ui/sun-path-card";
import { useAirQualityData } from "@/features/air-quality/model/use-air-quality-data";
import { getAirQualitySeries } from "@/lib/domain/air-quality-series";
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

function formatLocalTime(timeZone: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

// 気温から色を生成（データドリブン）
function temperatureToColor(temp: number): string {
  // 寒い（青系）← → 暖かい（オレンジ系）
  if (temp < 5) return "210, 90%"; // 青
  if (temp < 10) return "200, 85%";
  if (temp < 15) return "190, 80%"; // シアン
  if (temp < 20) return "160, 75%"; // 緑がかった
  if (temp < 25) return "50, 80%"; // 黄色
  if (temp < 30) return "35, 85%"; // オレンジ
  return "15, 90%"; // 赤
}

export default function ComparePage() {
  const [leftCityId, setLeftCityId] = useState<number>(cities[0].id);
  const [rightCityId, setRightCityId] = useState<number>(cities[1].id);

  const leftCity = cities.find((city) => city.id === leftCityId) ?? cities[0];
  const rightCity = cities.find((city) => city.id === rightCityId) ?? cities[1];

  const leftWeather = useWeatherData(leftCity, "24h");
  const rightWeather = useWeatherData(rightCity, "24h");
  const leftAir24 = useAirQualityData(leftCity, "24h");
  const rightAir24 = useAirQualityData(rightCity, "24h");
  const leftWeatherView = useWeatherSnapshot({
    hourly: leftWeather.data?.hourly,
    daily: leftWeather.data?.daily,
    timeZone: leftWeather.data?.timezone ?? leftCity.timezone,
  });
  const rightWeatherView = useWeatherSnapshot({
    hourly: rightWeather.data?.hourly,
    daily: rightWeather.data?.daily,
    timeZone: rightWeather.data?.timezone ?? rightCity.timezone,
  });

  const leftAirSeries = useMemo(
    () => getAirQualitySeries(leftAir24.data?.hourly, "24h"),
    [leftAir24.data],
  );
  const rightAirSeries = useMemo(
    () => getAirQualitySeries(rightAir24.data?.hourly, "24h"),
    [rightAir24.data],
  );

  // 背景色をデータから生成
  const leftBgColor = temperatureToColor(
    leftWeatherView?.snapshot.temperature ?? 20,
  );
  const rightBgColor = temperatureToColor(
    rightWeatherView?.snapshot.temperature ?? 20,
  );
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* データドリブンな背景グラデーション */}
      <div className="fixed inset-0 -z-10">
        {/* 左側のグラデーション */}
        <div
          className="absolute left-0 top-0 h-full w-1/2 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, hsl(${leftBgColor}, 40%) 0%, hsl(${leftBgColor}, 20%) 40%, transparent 70%)`,
          }}
        />
        {/* 右側のグラデーション */}
        <div
          className="absolute right-0 top-0 h-full w-1/2 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, hsl(${rightBgColor}, 40%) 0%, hsl(${rightBgColor}, 20%) 40%, transparent 70%)`,
          }}
        />
        {/* 中央のブレンド */}
        <div
          className="absolute left-1/2 top-0 h-full w-1/3 -translate-x-1/2 opacity-30 blur-3xl"
          style={{
            background: `linear-gradient(135deg, hsl(${leftBgColor}, 30%), hsl(${rightBgColor}, 30%))`,
          }}
        />
        {/* ベース背景 */}
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>

      <div className="mx-auto min-h-screen w-full px-6 py-8 lg:px-12 lg:py-12">
        {/* ヘッダー */}
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
              Atmospheric Comparison
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              都市比較
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/50 px-6 py-3 text-sm font-medium backdrop-blur-xl transition-all duration-300 hover:border-foreground/30 hover:bg-background/60 hover:shadow-lg hover:scale-105"
            >
              ← トップページへ
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
        <div className="mb-10 grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
          {/* 左の都市選択 */}
          <div className="rounded-2xl border border-foreground/10 bg-background/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/50 hover:shadow-lg">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Left City
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setLeftCityId(city.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105",
                    leftCityId === city.id
                      ? "border-foreground/30 bg-foreground/10 text-foreground shadow-lg"
                      : "border-transparent text-muted-foreground hover:border-foreground/20 hover:bg-foreground/5",
                  )}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          {/* 右の都市選択 */}
          <div className="rounded-2xl border border-foreground/10 bg-background/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/50 hover:shadow-lg">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Right City
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setRightCityId(city.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105",
                    rightCityId === city.id
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

        {/* 地図: 2都市を同時表示 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <h3 className="mb-4 text-xl font-bold tracking-tight text-foreground">
            位置関係
          </h3>
          <div className="relative h-[400px] overflow-hidden rounded-3xl border border-foreground/10 bg-background/50 p-4 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl lg:h-[500px]">
            <MapView
              center={[
                (leftCity.lon + rightCity.lon) / 2,
                (leftCity.lat + rightCity.lat) / 2,
              ]}
              zoom={5}
              markers={[
                {
                  lng: leftCity.lon,
                  lat: leftCity.lat,
                  label: leftCity.label,
                },
                {
                  lng: rightCity.lon,
                  lat: rightCity.lat,
                  label: rightCity.label,
                },
              ]}
              overlay="none"
            />
          </div>
        </section>

        {/* メインコンテンツ: 横長レイアウト */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* 左セクション */}
          <section className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-300">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {leftCity.label}
              </h2>
              <span className="text-sm text-muted-foreground">
                {formatLocalTime(leftCity.timezone)}
              </span>
            </div>

            {/* 天気カード（グラスモーフィズム） */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <WeatherCard
                temperature={leftWeatherView?.snapshot.temperature ?? 0}
                apparentTemperature={
                  leftWeatherView?.snapshot.apparentTemperature ?? 0
                }
                humidity={leftWeatherView?.snapshot.humidity ?? 0}
                windSpeed={leftWeatherView?.snapshot.windSpeed ?? 0}
                precipitationProbability={
                  leftWeatherView?.snapshot.precipitationProbability ?? 0
                }
                icon={
                  leftWeatherView?.weatherClassification ? (
                    <WeatherIcon
                      iconKey={leftWeatherView.weatherClassification.iconKey}
                      label={leftWeatherView.weatherClassification.label}
                      className="h-5 w-5"
                    />
                  ) : undefined
                }
                conditionLabel={leftWeatherView?.weatherClassification.label}
                isLoading={leftWeather.isLoading}
              />
            </div>

            {/* UV指数 */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <UVCard
                uvIndex={leftWeatherView?.snapshot.uvIndex ?? 0}
                uvIndexMax={leftWeatherView?.uvIndexMax}
                label={leftWeatherView?.uvClassification.label ?? "不明"}
                color={
                  leftWeatherView?.uvClassification.color ?? "hsl(0, 0%, 60%)"
                }
                isLoading={leftWeather.isLoading}
              />
            </div>

            {/* 風向き・風速 */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <WindCard
                windSpeed={leftWeatherView?.snapshot.windSpeed ?? 0}
                windDirection={leftWeatherView?.windDirectionRotation ?? 0}
                directionLabel={leftWeatherView?.windDirectionLabel ?? "不明"}
                isLoading={leftWeather.isLoading}
              />
            </div>

            {/* 日の出/日の入り */}
            {leftWeatherView?.sunriseAt && leftWeatherView.sunsetAt ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <SunPathCard
                  sunrise={new Date(
                    leftWeatherView.sunriseAt,
                  ).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  sunset={new Date(leftWeatherView.sunsetAt).toLocaleTimeString(
                    "ja-JP",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                  nowLabel={formatLocalTime(leftCity.timezone)}
                  phaseLabel={leftWeatherView.sunPhaseLabel}
                  progress={leftWeatherView.sunProgress}
                  background={leftWeatherView.sunPhaseBackground}
                  isLoading={leftWeather.isLoading}
                />
              </div>
            ) : null}

            {/* 気温の推移 */}
            {leftWeather.data?.hourly ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <WeatherChart
                  title="気温の推移"
                  range="24h"
                  data={leftWeather.data.hourly}
                  dataKey="temperature_2m"
                  timeZone={leftWeather.data.timezone}
                />
              </div>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-3xl border border-foreground/10 bg-muted/30 backdrop-blur-2xl" />
            )}

            {/* PM2.5グラフ */}
            {leftAirSeries && !leftAir24.isFetching ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <AQChart
                  title="PM2.5 推移"
                  data={leftAirSeries}
                  dataKey="pm2_5"
                  range="24h"
                  timeZone={leftAir24.data?.timezone ?? leftCity.timezone}
                />
              </div>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-3xl border border-foreground/10 bg-muted/30 backdrop-blur-2xl" />
            )}
          </section>

          {/* 右セクション */}
          <section className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-400">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {rightCity.label}
              </h2>
              <span className="text-sm text-muted-foreground">
                {formatLocalTime(rightCity.timezone)}
              </span>
            </div>

            {/* 天気カード（グラスモーフィズム） */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <WeatherCard
                temperature={rightWeatherView?.snapshot.temperature ?? 0}
                apparentTemperature={
                  rightWeatherView?.snapshot.apparentTemperature ?? 0
                }
                humidity={rightWeatherView?.snapshot.humidity ?? 0}
                windSpeed={rightWeatherView?.snapshot.windSpeed ?? 0}
                precipitationProbability={
                  rightWeatherView?.snapshot.precipitationProbability ?? 0
                }
                icon={
                  rightWeatherView?.weatherClassification ? (
                    <WeatherIcon
                      iconKey={rightWeatherView.weatherClassification.iconKey}
                      label={rightWeatherView.weatherClassification.label}
                      className="h-5 w-5"
                    />
                  ) : undefined
                }
                conditionLabel={rightWeatherView?.weatherClassification.label}
                isLoading={rightWeather.isLoading}
              />
            </div>

            {/* UV指数 */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <UVCard
                uvIndex={rightWeatherView?.snapshot.uvIndex ?? 0}
                uvIndexMax={rightWeatherView?.uvIndexMax}
                label={rightWeatherView?.uvClassification.label ?? "不明"}
                color={
                  rightWeatherView?.uvClassification.color ?? "hsl(0, 0%, 60%)"
                }
                isLoading={rightWeather.isLoading}
              />
            </div>

            {/* 風向き・風速 */}
            <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
              <WindCard
                windSpeed={rightWeatherView?.snapshot.windSpeed ?? 0}
                windDirection={rightWeatherView?.windDirectionRotation ?? 0}
                directionLabel={rightWeatherView?.windDirectionLabel ?? "不明"}
                isLoading={rightWeather.isLoading}
              />
            </div>

            {/* 日の出/日の入り */}
            {rightWeatherView?.sunriseAt && rightWeatherView.sunsetAt ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <SunPathCard
                  sunrise={new Date(
                    rightWeatherView.sunriseAt,
                  ).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  sunset={new Date(
                    rightWeatherView.sunsetAt,
                  ).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  nowLabel={formatLocalTime(rightCity.timezone)}
                  phaseLabel={rightWeatherView.sunPhaseLabel}
                  progress={rightWeatherView.sunProgress}
                  background={rightWeatherView.sunPhaseBackground}
                  isLoading={rightWeather.isLoading}
                />
              </div>
            ) : null}

            {/* 気温の推移 */}
            {rightWeather.data?.hourly ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <WeatherChart
                  title="気温の推移"
                  range="24h"
                  data={rightWeather.data.hourly}
                  dataKey="temperature_2m"
                  timeZone={rightWeather.data.timezone}
                />
              </div>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-3xl border border-foreground/10 bg-muted/30 backdrop-blur-2xl" />
            )}

            {/* PM2.5グラフ */}
            {rightAirSeries && !rightAir24.isFetching ? (
              <div className="group rounded-3xl border border-foreground/10 bg-background/50 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl hover:-translate-y-1">
                <AQChart
                  title="PM2.5 推移"
                  data={rightAirSeries}
                  dataKey="pm2_5"
                  range="24h"
                  timeZone={rightAir24.data?.timezone ?? rightCity.timezone}
                />
              </div>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-3xl border border-foreground/10 bg-muted/30 backdrop-blur-2xl" />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
