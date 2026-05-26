"use client";

import { useState } from "react";
import { WeatherChart } from "@/features/weather/ui/weather-chart";
import { AQChart } from "@/features/air-quality/ui/aq-chart";
import { cn } from "@/lib/utils";
import type { WeatherHourly } from "@/lib/types/weather";
import type { AirQualityHourly } from "@/lib/types/air-quality";

type ChartTabsProps = {
  weatherHourly?: WeatherHourly;
  weatherTimeZone: string;
  weatherUtcOffset?: number;
  airSeries?: AirQualityHourly;
  airTimeZone: string;
  airUtcOffset?: number;
  isAirFetching: boolean;
};

const tabs = [
  { key: "temp", label: "気温" },
  { key: "pm25", label: "PM2.5" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function ChartTabs({
  weatherHourly,
  weatherTimeZone,
  weatherUtcOffset,
  airSeries,
  airTimeZone,
  airUtcOffset,
  isAirFetching,
}: ChartTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("temp");

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg bg-muted/20 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-md px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2px] transition-all duration-200",
              activeTab === tab.key
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "temp" ? (
        weatherHourly ? (
          <WeatherChart
            title="気温の推移"
            range="24h"
            data={weatherHourly}
            dataKey="temperature_2m"
            timeZone={weatherTimeZone}
            utcOffsetSeconds={weatherUtcOffset}
          />
        ) : (
          <div className="h-[260px] w-full animate-pulse rounded-2xl bg-muted/30" />
        )
      ) : airSeries && !isAirFetching ? (
        <AQChart
          title="PM2.5 推移"
          data={airSeries}
          dataKey="pm2_5"
          range="24h"
          timeZone={airTimeZone}
          utcOffsetSeconds={airUtcOffset}
        />
      ) : (
        <div className="h-[260px] w-full animate-pulse rounded-2xl bg-muted/30" />
      )}
    </div>
  );
}
