"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeatherDaily, WeatherHourly } from "@/lib/types/weather";
import { cn } from "@/lib/utils";

type HourlyKey =
  | "temperature_2m"
  | "precipitation_probability"
  | "wind_speed_10m"
  | "apparent_temperature";

type DailyKey =
  | "temperature_2m_max"
  | "temperature_2m_min"
  | "precipitation_sum"
  | "precipitation_probability_max";

type BaseChartProps = {
  title?: string;
  timeZone?: string;
  onRangeChange?: (range: "24h" | "7d") => void;
};

export type WeatherChartProps =
  | (BaseChartProps & {
      range: "24h";
      data: WeatherHourly;
      dataKey: HourlyKey;
    })
  | (BaseChartProps & {
      range: "7d";
      data: WeatherDaily;
      dataKey: DailyKey;
    });

type ChartPoint = {
  time: string;
  value: number;
};

function formatTimeLabel(
  value: string,
  range: "24h" | "7d",
  timeZone?: string,
) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const options: Intl.DateTimeFormatOptions =
    range === "24h"
      ? { hour: "2-digit", minute: "2-digit" }
      : { month: "numeric", day: "numeric" };

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    ...options,
  }).format(date);
}

export function WeatherChart({
  data,
  range,
  dataKey,
  title,
  timeZone,
  onRangeChange,
}: WeatherChartProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    const times = data.time;
    const values =
      range === "24h"
        ? (data as WeatherHourly)[dataKey as HourlyKey]
        : (data as WeatherDaily)[dataKey as DailyKey];

    return times.map((time, index) => ({
      time: formatTimeLabel(time, range, timeZone),
      value: values[index] ?? 0,
    }));
  }, [data, dataKey, range, timeZone]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">
          {title ?? "天気チャート"}
        </div>
        {onRangeChange && (
          <div className="flex items-center gap-2 rounded-full bg-muted/30 p-1 text-xs">
            {(["24h", "7d"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onRangeChange(value)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium transition",
                  range === value
                    ? "bg-background/60 text-foreground shadow"
                    : "text-muted-foreground",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 h-[260px] min-h-[240px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(200, 85%, 55%)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(200, 85%, 55%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
