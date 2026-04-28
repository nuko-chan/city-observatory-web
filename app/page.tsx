"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WeatherChart } from "@/features/weather/ui/weather-chart";
import { AQChart } from "@/features/air-quality/ui/aq-chart";
import { MapView } from "@/features/map/ui/map-view";
import { MapOverlayToggle } from "@/features/map/ui/map-overlay-toggle";
import { useWeatherData } from "@/features/weather/model/use-weather-data";
import { useWeatherSnapshot } from "@/features/weather/model/use-weather-snapshot";
import { WeatherIcon } from "@/features/weather/ui/weather-icon";
import { UVCard } from "@/features/weather/ui/uv-card";
import { WindCard } from "@/features/weather/ui/wind-card";
import { SunPathBand } from "@/features/weather/ui/sun-path-band";
import { ComfortSummaryCard } from "@/features/derived-metrics/ui/comfort-summary-card";
import { useAirQualityData } from "@/features/air-quality/model/use-air-quality-data";
import { GlassCard } from "@/components/ui/glass-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { useRealtimeClock } from "@/lib/hooks/use-realtime-clock";
import { getAirQualitySeries } from "@/lib/domain/air-quality-series";
import { getAirQualitySnapshot } from "@/lib/domain/air-quality-snapshot";
import { calculateComfortScore } from "@/lib/domain/comfort-score";
import { calculateOutdoorRisk } from "@/lib/domain/outdoor-risk";
import { cities } from "@/lib/constants/cities";
import { cn } from "@/lib/utils";
import { temperatureToColor } from "@/lib/utils/formatting";

const defaultCityId = cities[0].id;

export default function Home() {
  const [selectedCityId, setSelectedCityId] = useState<number>(defaultCityId);
  const [mapOverlay, setMapOverlay] = useState<"none" | "precipitation">(
    "none",
  );
  const [nowMs] = useState(() => Date.now());
  const [activeChartTab, setActiveChartTab] = useState<"temp" | "pm25">("temp");

  const activeCity =
    cities.find((city) => city.id === selectedCityId) ?? cities[0];
  const clock = useRealtimeClock(activeCity.timezone);

  const weatherQuery = useWeatherData(activeCity, "24h");
  const airQuery = useAirQualityData(activeCity, "24h");
  const weatherView = useWeatherSnapshot({
    hourly: weatherQuery.data?.hourly,
    daily: weatherQuery.data?.daily,
    timeZone: weatherQuery.data?.timezone ?? activeCity.timezone,
    utcOffsetSeconds: weatherQuery.data?.utc_offset_seconds,
  });
  const airSnapshot = getAirQualitySnapshot(
    airQuery.data?.hourly,
    nowMs,
    airQuery.data?.utc_offset_seconds,
  );
  const comfortScore = calculateComfortScore({
    temperature: weatherView?.snapshot.temperature ?? 0,
    humidity: weatherView?.snapshot.humidity ?? 0,
    windSpeed: weatherView?.snapshot.windSpeed ?? 0,
    precipitationProbability:
      weatherView?.snapshot.precipitationProbability ?? 0,
    pm25: airSnapshot?.pm25 ?? 0,
  });
  const outdoorRiskLevel = calculateOutdoorRisk({
    precipitationProbability:
      weatherView?.snapshot.precipitationProbability ?? 0,
    windSpeed: weatherView?.snapshot.windSpeed ?? 0,
    pm25: airSnapshot?.pm25 ?? 0,
  });

  const airSeries = useMemo(
    () => getAirQualitySeries(airQuery.data?.hourly, "24h"),
    [airQuery.data],
  );

  const bgColor = temperatureToColor(weatherView?.snapshot.temperature ?? 20);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* メッシュグラデーション背景 */}
      <div className="fixed inset-0 -z-10">
        <svg className="absolute h-0 w-0">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="5"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        <div
          className="absolute inset-0 opacity-50 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, hsl(${bgColor}, 28%) 0%, transparent 50%),
              radial-gradient(circle at 80% 60%, hsl(${bgColor}, 22%) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, hsl(${bgColor}, 18%) 0%, transparent 60%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at 60% 40%, hsl(${(parseInt(bgColor.split(" ")[0]) + 30) % 360} ${bgColor.split(" ")[1]} ${bgColor.split(" ")[2]}, 20%) 0%, transparent 45%),
              radial-gradient(circle at 30% 70%, hsl(${(parseInt(bgColor.split(" ")[0]) - 20) % 360} ${bgColor.split(" ")[1]} ${bgColor.split(" ")[2]}, 16%) 0%, transparent 50%)
            `,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
          style={{ filter: "url(#noise)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>

      <div className="mx-auto min-h-screen w-full px-6 py-8 lg:px-12 lg:py-12">
        {/* ヘッダー + 都市選択 */}
        <header className="animate-card-in mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
              City Observatory
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setSelectedCityId(city.id)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%)] backdrop-blur-[16px] transition-all duration-300 hover:scale-105",
                    selectedCityId === city.id
                      ? "bg-foreground text-background shadow-[0px_0px_0px_1px_transparent]"
                      : "bg-background/50 text-muted-foreground hover:bg-background/60 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/30%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]",
                  )}
                >
                  {city.label}
                </button>
              ))}
              <span className="mx-1 h-4 w-px bg-foreground/15" />
              <Link
                href="/compare"
                className="rounded-full bg-background/50 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%)] backdrop-blur-[16px] transition-all duration-300 hover:scale-105 hover:bg-background/60"
              >
                比較 →
              </Link>
            </div>
          </div>
        </header>

        {/* ヒーローセクション */}
        <section
          className="animate-card-in mb-10"
          style={{ animationDelay: "100ms" }}
        >
          {weatherQuery.isLoading ? (
            <div className="space-y-4">
              <div className="h-28 w-64 animate-pulse rounded-2xl bg-muted/30" />
              <div className="h-6 w-48 animate-pulse rounded-md bg-muted/30" />
            </div>
          ) : (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-end gap-5">
                <div className="font-mono text-[7rem] font-semibold leading-none tracking-[-4px] text-foreground [font-feature-settings:'tnum']">
                  {Math.round(weatherView?.snapshot.temperature ?? 0)}
                  <span className="text-[2rem] font-normal tracking-normal text-foreground/60">
                    ℃
                  </span>
                </div>
                <div className="mb-3 flex flex-col gap-1">
                  {weatherView?.weatherClassification ? (
                    <>
                      <WeatherIcon
                        iconKey={weatherView.weatherClassification.iconKey}
                        label={weatherView.weatherClassification.label}
                        className="h-14 w-14 text-foreground/70"
                      />
                      <span
                        className="mt-1 text-lg font-medium"
                        style={{
                          color:
                            weatherView.weatherClassification.badgeColor ??
                            undefined,
                        }}
                      >
                        {weatherView.weatherClassification.label}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="mb-3 flex flex-col items-start gap-2 lg:items-end">
                <div className="text-sm text-muted-foreground">
                  体感{" "}
                  <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
                    {Math.round(weatherView?.snapshot.apparentTemperature ?? 0)}
                    ℃
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>
                    湿度{" "}
                    <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
                      {Math.round(weatherView?.snapshot.humidity ?? 0)}%
                    </span>
                  </span>
                  <span className="text-foreground/20">·</span>
                  <span>
                    風速{" "}
                    <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
                      {(weatherView?.snapshot.windSpeed ?? 0).toFixed(1)} m/s
                    </span>
                  </span>
                  <span className="text-foreground/20">·</span>
                  <span>
                    降水{" "}
                    <span className="font-mono font-semibold text-foreground [font-feature-settings:'tnum']">
                      {Math.round(
                        weatherView?.snapshot.precipitationProbability ?? 0,
                      )}
                      %
                    </span>
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {clock.datePart}
                </div>
                <div className="font-mono text-xs text-muted-foreground [font-feature-settings:'tnum']">
                  {clock.timePart}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* メトリクスグリッド */}
        <section
          className="animate-card-in mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3"
          style={{ animationDelay: "200ms" }}
        >
          <GlassCard className="min-h-[140px]">
            <UVCard
              uvIndex={weatherView?.snapshot.uvIndex ?? 0}
              uvIndexMax={weatherView?.uvIndexMax}
              label={weatherView?.uvClassification.label ?? "不明"}
              color={weatherView?.uvClassification.color ?? "hsl(0, 0%, 60%)"}
              isLoading={weatherQuery.isLoading}
              compact
            />
          </GlassCard>

          <GlassCard className="min-h-[140px]">
            <ComfortSummaryCard
              comfortScore={comfortScore}
              outdoorRiskLevel={outdoorRiskLevel}
              pm25={airSnapshot?.pm25 ?? 0}
              isLoading={weatherQuery.isLoading || airQuery.isLoading}
              compact
            />
          </GlassCard>

          <GlassCard className="min-h-[140px]">
            <WindCard
              windSpeed={weatherView?.snapshot.windSpeed ?? 0}
              windDirection={weatherView?.windDirectionRotation ?? 0}
              directionLabel={weatherView?.windDirectionLabel ?? "不明"}
              isLoading={weatherQuery.isLoading}
              compact
            />
          </GlassCard>
        </section>

        {/* SunPath バンド */}
        {weatherView?.sunriseAt && weatherView.sunsetAt ? (
          <section
            className="animate-card-in mb-8"
            style={{ animationDelay: "300ms" }}
          >
            <GlassCard className="px-6 py-3" hoverable={false}>
              <SunPathBand
                sunrise={weatherView.sunriseAt.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: weatherView.timeZone,
                })}
                sunset={weatherView.sunsetAt.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: weatherView.timeZone,
                })}
                progress={weatherView.sunProgress}
                phaseLabel={weatherView.sunPhaseLabel}
              />
            </GlassCard>
          </section>
        ) : null}

        {/* チャートタブ + マップ */}
        <section
          className="animate-card-in grid gap-6 lg:grid-cols-2"
          style={{ animationDelay: "400ms" }}
        >
          <GlassCard>
            <div className="mb-4 flex items-center gap-1 rounded-lg bg-muted/20 p-1">
              {(
                [
                  { key: "temp", label: "気温" },
                  { key: "pm25", label: "PM2.5" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveChartTab(tab.key)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2px] transition-all duration-200",
                    activeChartTab === tab.key
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeChartTab === "temp" ? (
              weatherQuery.data?.hourly ? (
                <WeatherChart
                  title="気温の推移"
                  range="24h"
                  data={weatherQuery.data.hourly}
                  dataKey="temperature_2m"
                  timeZone={weatherQuery.data.timezone}
                  utcOffsetSeconds={weatherQuery.data.utc_offset_seconds}
                />
              ) : (
                <div className="h-[260px] w-full animate-pulse rounded-2xl bg-muted/30" />
              )
            ) : airSeries && !airQuery.isFetching ? (
              <AQChart
                title="PM2.5 推移"
                data={airSeries}
                dataKey="pm2_5"
                range="24h"
                timeZone={airQuery.data?.timezone ?? activeCity.timezone}
                utcOffsetSeconds={airQuery.data?.utc_offset_seconds}
              />
            ) : (
              <div className="h-[260px] w-full animate-pulse rounded-2xl bg-muted/30" />
            )}
          </GlassCard>

          <GlassCard className="relative overflow-hidden p-4">
            <div className="absolute left-6 top-6 z-10">
              <MapOverlayToggle value={mapOverlay} onChange={setMapOverlay} />
            </div>
            <div className="h-full min-h-[360px]">
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
          </GlassCard>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
