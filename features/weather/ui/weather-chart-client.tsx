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
import { toUtcDateFromLocalTime } from "@/lib/utils/timezone";

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
  utcOffsetSeconds?: number;
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
  utcOffsetSeconds?: number,
) {
  const date = toUtcDateFromLocalTime(value, utcOffsetSeconds);
  if (!date) return value;
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
  utcOffsetSeconds,
  onRangeChange,
}: WeatherChartProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    const times = data.time;
    const values =
      range === "24h"
        ? (data as WeatherHourly)[dataKey as HourlyKey]
        : (data as WeatherDaily)[dataKey as DailyKey];

    return times.map((time, index) => ({
      time: formatTimeLabel(time, range, timeZone, utcOffsetSeconds),
      value: values[index] ?? 0,
    }));
  }, [data, dataKey, range, timeZone, utcOffsetSeconds]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
          {title ?? "天気チャート"}
        </div>
        {onRangeChange && (
          <div className="flex items-center gap-1 rounded-md bg-muted/30 p-1 text-xs">
            {(["24h", "7d"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onRangeChange(value)}
                className={cn(
                  "rounded-md px-3 py-1 font-medium uppercase tracking-[0.2px] transition",
                  range === value
                    ? "bg-foreground text-background shadow"
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
              stroke="var(--muted-foreground)"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
                fontFamily: "var(--font-geist-mono)",
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              stroke="var(--muted-foreground)"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
                fontFamily: "var(--font-geist-mono)",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:
                  "color-mix(in oklch, var(--background) 50%, transparent)",
                border: "none",
                borderRadius: "8px",
                boxShadow:
                  "0px 0px 0px 1px color-mix(in oklch, var(--foreground) 10%, transparent), 0px 2px 4px color-mix(in oklch, var(--foreground) 4%, transparent)",
                backdropFilter: "blur(40px)",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "var(--chart-1)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
