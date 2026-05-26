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
import { GlassCard } from "@/components/ui/glass-card";
import { getAirQualitySeries } from "@/lib/domain/air-quality-series";
import { cities } from "@/lib/constants/cities";
import { cn } from "@/lib/utils";
import {
  formatLocalTime,
  temperatureHsl,
  temperatureToColor,
} from "@/lib/utils/formatting";

const defaultLeftCityId = cities[0].id;
const defaultRightCityId = cities[1].id;

export default function ComparePage() {
  const [leftCityId, setLeftCityId] = useState<number>(defaultLeftCityId);
  const [rightCityId, setRightCityId] = useState<number>(defaultRightCityId);

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
    utcOffsetSeconds: leftWeather.data?.utc_offset_seconds,
  });
  const rightWeatherView = useWeatherSnapshot({
    hourly: rightWeather.data?.hourly,
    daily: rightWeather.data?.daily,
    timeZone: rightWeather.data?.timezone ?? rightCity.timezone,
    utcOffsetSeconds: rightWeather.data?.utc_offset_seconds,
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
      {/* ノイズテクスチャ付きメッシュグラデーション */}
      <div className="fixed inset-0 -z-10">
        {/* SVGノイズフィルター（強化版） */}
        <svg className="absolute h-0 w-0">
          <filter id="noise-compare">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="5"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {/* 左側の都市：複数のグラデーションレイヤー（彩度を抑えて高級感） */}
        <div
          className="absolute left-0 top-0 h-full w-1/2 opacity-50 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at 15% 20%, ${temperatureHsl(leftBgColor, "28%")} 0%, transparent 45%),
              radial-gradient(circle at 35% 65%, ${temperatureHsl(leftBgColor, "22%")} 0%, transparent 50%),
              radial-gradient(ellipse at 10% 80%, ${temperatureHsl(leftBgColor, "18%")} 0%, transparent 55%)
            `,
          }}
        />
        <div
          className="absolute left-0 top-0 h-full w-1/2 opacity-30 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at 25% 45%, ${temperatureHsl({ ...leftBgColor, hue: (leftBgColor.hue + 25) % 360 }, "20%")} 0%, transparent 42%)
            `,
          }}
        />

        {/* 右側の都市：複数のグラデーションレイヤー（彩度を抑えて高級感） */}
        <div
          className="absolute right-0 top-0 h-full w-1/2 opacity-50 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at 85% 20%, ${temperatureHsl(rightBgColor, "28%")} 0%, transparent 45%),
              radial-gradient(circle at 65% 65%, ${temperatureHsl(rightBgColor, "22%")} 0%, transparent 50%),
              radial-gradient(ellipse at 90% 80%, ${temperatureHsl(rightBgColor, "18%")} 0%, transparent 55%)
            `,
          }}
        />
        <div
          className="absolute right-0 top-0 h-full w-1/2 opacity-30 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at 75% 45%, ${temperatureHsl({ ...rightBgColor, hue: (rightBgColor.hue + 25) % 360 }, "20%")} 0%, transparent 42%)
            `,
          }}
        />

        {/* 中央のブレンドゾーン */}
        <div
          className="absolute left-1/2 top-0 h-full w-1/3 -translate-x-1/2 opacity-20 blur-3xl transition-all duration-1000"
          style={{
            background: `linear-gradient(135deg, ${temperatureHsl(leftBgColor, "18%")}, ${temperatureHsl(rightBgColor, "18%")})`,
          }}
        />

        {/* ノイズテクスチャオーバーレイ（強化） */}
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
          style={{ filter: "url(#noise-compare)" }}
        />

        {/* ビネット効果（周辺を暗く） */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />

        {/* ベース背景 */}
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>

      <div className="mx-auto min-h-screen w-full px-6 py-8 lg:px-12 lg:py-12">
        {/* ヘッダー */}
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between animate-card-in">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
              Atmospheric Comparison
            </div>
            <h1 className="mt-2 text-[3rem] font-semibold leading-[1.17] tracking-[-2.4px] text-foreground">
              都市比較
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-background/50 px-6 py-3 text-sm font-medium shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%)] backdrop-blur-[16px] transition-all duration-300 hover:scale-105 hover:bg-background/60 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/30%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]"
            >
              ← トップページへ
            </Link>
          </div>
        </header>

        {/* 都市選択 */}
        <div className="mb-10 grid gap-6 lg:grid-cols-2 animate-card-in [animation-delay:100ms]">
          <div className="rounded-2xl bg-background/40 p-5 shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%)] backdrop-blur-[16px] transition-all duration-300 hover:bg-background/50 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
              Left City
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setLeftCityId(city.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%)] backdrop-blur-[16px] transition-all duration-300 hover:scale-105",
                    leftCityId === city.id
                      ? "bg-foreground text-background shadow-[0px_0px_0px_1px_transparent]"
                      : "bg-background/50 text-muted-foreground hover:bg-background/60 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/30%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]",
                  )}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-background/40 p-5 shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%)] backdrop-blur-[16px] transition-all duration-300 hover:bg-background/50 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
              Right City
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setRightCityId(city.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%)] backdrop-blur-[16px] transition-all duration-300 hover:scale-105",
                    rightCityId === city.id
                      ? "bg-foreground text-background shadow-[0px_0px_0px_1px_transparent]"
                      : "bg-background/50 text-muted-foreground hover:bg-background/60 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/30%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]",
                  )}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 地図: 2都市を同時表示 */}
        <section className="animate-card-in [animation-delay:200ms]">
          <h3 className="mb-4 text-xl font-semibold tracking-[-0.96px] text-foreground">
            位置関係
          </h3>
          <GlassCard className="relative h-[400px] overflow-hidden p-4 lg:h-[500px]">
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
          </GlassCard>
        </section>

        {/* メインコンテンツ: 横長レイアウト */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* 左セクション */}
          <section className="space-y-6 animate-card-in [animation-delay:300ms]">
            <div className="flex items-baseline gap-3">
              <h2 className="text-[2rem] font-semibold tracking-[-1.28px] text-foreground">
                {leftCity.label}
              </h2>
              <span className="font-mono text-sm text-muted-foreground [font-feature-settings:'tnum']">
                {formatLocalTime(leftCity.timezone)}
              </span>
            </div>

            <GlassCard>
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
                badgeColor={leftWeatherView?.weatherClassification.badgeColor}
                isLoading={leftWeather.isLoading}
              />
            </GlassCard>

            <GlassCard>
              <UVCard
                uvIndex={leftWeatherView?.snapshot.uvIndex ?? 0}
                uvIndexMax={leftWeatherView?.uvIndexMax}
                label={leftWeatherView?.uvClassification.label ?? "不明"}
                color={
                  leftWeatherView?.uvClassification.color ?? "hsl(0, 0%, 60%)"
                }
                isLoading={leftWeather.isLoading}
              />
            </GlassCard>

            <GlassCard>
              <WindCard
                windSpeed={leftWeatherView?.snapshot.windSpeed ?? 0}
                windDirection={leftWeatherView?.windDirectionRotation ?? 0}
                directionLabel={leftWeatherView?.windDirectionLabel ?? "不明"}
                isLoading={leftWeather.isLoading}
              />
            </GlassCard>

            {leftWeatherView?.sunriseAt && leftWeatherView.sunsetAt ? (
              <GlassCard>
                <SunPathCard
                  sunrise={leftWeatherView.sunriseAt.toLocaleTimeString(
                    "ja-JP",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: leftWeatherView.timeZone,
                    },
                  )}
                  sunset={leftWeatherView.sunsetAt.toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: leftWeatherView.timeZone,
                  })}
                  nowLabel={formatLocalTime(leftCity.timezone)}
                  phaseLabel={leftWeatherView.sunPhaseLabel}
                  progress={leftWeatherView.sunProgress}
                  background={leftWeatherView.sunPhaseBackground}
                  isLoading={leftWeather.isLoading}
                />
              </GlassCard>
            ) : null}

            {leftWeather.data?.hourly ? (
              <GlassCard>
                <WeatherChart
                  title="気温の推移"
                  range="24h"
                  data={leftWeather.data.hourly}
                  dataKey="temperature_2m"
                  timeZone={leftWeather.data.timezone}
                  utcOffsetSeconds={leftWeather.data.utc_offset_seconds}
                />
              </GlassCard>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-[var(--radius-3xl)] bg-muted/30 shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%)] backdrop-blur-[40px]" />
            )}

            {leftAirSeries && !leftAir24.isFetching ? (
              <GlassCard>
                <AQChart
                  title="PM2.5 推移"
                  data={leftAirSeries}
                  dataKey="pm2_5"
                  range="24h"
                  timeZone={leftAir24.data?.timezone ?? leftCity.timezone}
                  utcOffsetSeconds={leftAir24.data?.utc_offset_seconds}
                />
              </GlassCard>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-[var(--radius-3xl)] bg-muted/30 shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%)] backdrop-blur-[40px]" />
            )}
          </section>

          {/* 右セクション */}
          <section className="space-y-6 animate-card-in [animation-delay:400ms]">
            <div className="flex items-baseline gap-3">
              <h2 className="text-[2rem] font-semibold tracking-[-1.28px] text-foreground">
                {rightCity.label}
              </h2>
              <span className="font-mono text-sm text-muted-foreground [font-feature-settings:'tnum']">
                {formatLocalTime(rightCity.timezone)}
              </span>
            </div>

            <GlassCard>
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
                badgeColor={rightWeatherView?.weatherClassification.badgeColor}
                isLoading={rightWeather.isLoading}
              />
            </GlassCard>

            <GlassCard>
              <UVCard
                uvIndex={rightWeatherView?.snapshot.uvIndex ?? 0}
                uvIndexMax={rightWeatherView?.uvIndexMax}
                label={rightWeatherView?.uvClassification.label ?? "不明"}
                color={
                  rightWeatherView?.uvClassification.color ?? "hsl(0, 0%, 60%)"
                }
                isLoading={rightWeather.isLoading}
              />
            </GlassCard>

            <GlassCard>
              <WindCard
                windSpeed={rightWeatherView?.snapshot.windSpeed ?? 0}
                windDirection={rightWeatherView?.windDirectionRotation ?? 0}
                directionLabel={rightWeatherView?.windDirectionLabel ?? "不明"}
                isLoading={rightWeather.isLoading}
              />
            </GlassCard>

            {rightWeatherView?.sunriseAt && rightWeatherView.sunsetAt ? (
              <GlassCard>
                <SunPathCard
                  sunrise={rightWeatherView.sunriseAt.toLocaleTimeString(
                    "ja-JP",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: rightWeatherView.timeZone,
                    },
                  )}
                  sunset={rightWeatherView.sunsetAt.toLocaleTimeString(
                    "ja-JP",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: rightWeatherView.timeZone,
                    },
                  )}
                  nowLabel={formatLocalTime(rightCity.timezone)}
                  phaseLabel={rightWeatherView.sunPhaseLabel}
                  progress={rightWeatherView.sunProgress}
                  background={rightWeatherView.sunPhaseBackground}
                  isLoading={rightWeather.isLoading}
                />
              </GlassCard>
            ) : null}

            {rightWeather.data?.hourly ? (
              <GlassCard>
                <WeatherChart
                  title="気温の推移"
                  range="24h"
                  data={rightWeather.data.hourly}
                  dataKey="temperature_2m"
                  timeZone={rightWeather.data.timezone}
                  utcOffsetSeconds={rightWeather.data.utc_offset_seconds}
                />
              </GlassCard>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-[var(--radius-3xl)] bg-muted/30 shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%)] backdrop-blur-[40px]" />
            )}

            {rightAirSeries && !rightAir24.isFetching ? (
              <GlassCard>
                <AQChart
                  title="PM2.5 推移"
                  data={rightAirSeries}
                  dataKey="pm2_5"
                  range="24h"
                  timeZone={rightAir24.data?.timezone ?? rightCity.timezone}
                  utcOffsetSeconds={rightAir24.data?.utc_offset_seconds}
                />
              </GlassCard>
            ) : (
              <div className="h-[320px] w-full animate-pulse rounded-[var(--radius-3xl)] bg-muted/30 shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%)] backdrop-blur-[40px]" />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
