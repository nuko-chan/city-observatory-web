"use client";

import { useState } from "react";
import Link from "next/link";
import { MapView } from "@/features/map/ui/map-view";
import { MapOverlayToggle } from "@/features/map/ui/map-overlay-toggle";
import { UVCard } from "@/features/weather/ui/uv-card";
import { WindCard } from "@/features/weather/ui/wind-card";
import { SunPathBand } from "@/features/weather/ui/sun-path-band";
import { ComfortSummaryCard } from "@/features/derived-metrics/ui/comfort-summary-card";
import { GlassCard } from "@/components/ui/glass-card";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";
import { HeroSection } from "@/components/layout/hero-section";
import { ChartTabs } from "@/components/layout/chart-tabs";
import { SiteFooter } from "@/components/layout/site-footer";
import { useCityDashboard } from "@/lib/hooks/use-city-dashboard";
import { cities } from "@/lib/constants/cities";
import { cn } from "@/lib/utils";

const defaultCityId = cities[0].id;

export default function Home() {
  const [selectedCityId, setSelectedCityId] = useState<number>(defaultCityId);
  const [mapOverlay, setMapOverlay] = useState<"none" | "precipitation">(
    "none",
  );

  const activeCity =
    cities.find((city) => city.id === selectedCityId) ?? cities[0];

  const {
    weatherQuery,
    airQuery,
    weatherView,
    airSnapshot,
    comfortScore,
    outdoorRiskLevel,
    airSeries,
    bgColor,
  } = useCityDashboard(activeCity);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MeshGradientBackground color={bgColor} />

      <div className="mx-auto min-h-screen w-full px-6 py-8 lg:px-12 lg:py-12">
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

        <section
          className="animate-card-in mb-10"
          style={{ animationDelay: "100ms" }}
        >
          <HeroSection
            snapshot={{
              temperature: weatherView?.snapshot.temperature ?? 0,
              apparentTemperature:
                weatherView?.snapshot.apparentTemperature ?? 0,
              humidity: weatherView?.snapshot.humidity ?? 0,
              windSpeed: weatherView?.snapshot.windSpeed ?? 0,
              precipitationProbability:
                weatherView?.snapshot.precipitationProbability ?? 0,
            }}
            weatherClassification={weatherView?.weatherClassification}
            timeZone={activeCity.timezone}
            isLoading={weatherQuery.isLoading}
          />
        </section>

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

        <section
          className="animate-card-in grid gap-6 lg:grid-cols-2"
          style={{ animationDelay: "400ms" }}
        >
          <GlassCard>
            <ChartTabs
              weatherHourly={weatherQuery.data?.hourly}
              weatherTimeZone={
                weatherQuery.data?.timezone ?? activeCity.timezone
              }
              weatherUtcOffset={weatherQuery.data?.utc_offset_seconds}
              airSeries={airSeries}
              airTimeZone={airQuery.data?.timezone ?? activeCity.timezone}
              airUtcOffset={airQuery.data?.utc_offset_seconds}
              isAirFetching={airQuery.isFetching}
            />
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
