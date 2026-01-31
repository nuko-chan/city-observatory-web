"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AirQualityHourly } from "@/lib/types/air-quality";
import { cn } from "@/lib/utils";

type AQKey = "pm2_5" | "pm10" | "nitrogen_dioxide" | "ozone";

type AQChartProps = {
  data: AirQualityHourly;
  dataKey: AQKey;
  range: "24h" | "5d";
  title?: string;
  timeZone?: string;
  onRangeChange?: (range: "24h" | "5d") => void;
};

type ChartPoint = {
  time: string;
  value: number;
};

function formatTimeLabel(
  value: string,
  range: "24h" | "5d",
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

export function AQChart({
  data,
  dataKey,
  range,
  title,
  timeZone,
  onRangeChange,
}: AQChartProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    const values = data[dataKey];
    return data.time.map((time, index) => ({
      time: formatTimeLabel(time, range, timeZone),
      value: values[index] ?? 0,
    }));
  }, [data, dataKey, range, timeZone]);

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">
          {title ?? "大気質チャート"}
        </div>
        {onRangeChange && (
          <div className="flex items-center gap-2 rounded-full bg-muted p-1 text-xs">
            {(["24h", "5d"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onRangeChange(value)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium transition",
                  range === value
                    ? "bg-background text-foreground shadow"
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
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="aqValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="url(#aqValue)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
