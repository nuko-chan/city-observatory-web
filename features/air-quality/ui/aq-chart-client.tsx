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
import type { AirQualityHourly } from "@/lib/types/air-quality";
import { cn } from "@/lib/utils";
import { toUtcDateFromLocalTime } from "@/lib/utils/timezone";

type AQKey = "pm2_5" | "pm10" | "nitrogen_dioxide" | "ozone";

type AQChartProps = {
  data: AirQualityHourly;
  dataKey: AQKey;
  range: "24h" | "5d";
  title?: string;
  timeZone?: string;
  utcOffsetSeconds?: number;
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
  utcOffsetSeconds?: number,
) {
  const date = toUtcDateFromLocalTime(value, utcOffsetSeconds);
  if (!date || Number.isNaN(date.getTime())) return value;

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
  utcOffsetSeconds,
  onRangeChange,
}: AQChartProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    const values = data[dataKey];
    return data.time.map((time, index) => ({
      time: formatTimeLabel(time, range, timeZone, utcOffsetSeconds),
      value: values[index] ?? 0,
    }));
  }, [data, dataKey, range, timeZone, utcOffsetSeconds]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">
          {title ?? "大気質チャート"}
        </div>
        {onRangeChange && (
          <div className="flex items-center gap-2 rounded-full bg-muted/30 p-1 text-xs">
            {(["24h", "5d"] as const).map((value) => (
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
              stroke="hsl(280, 75%, 60%)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(280, 75%, 60%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
