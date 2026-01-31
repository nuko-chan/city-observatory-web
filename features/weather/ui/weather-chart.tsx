import dynamic from "next/dynamic";

export type { WeatherChartProps } from "./weather-chart-client";

export const WeatherChart = dynamic(
  () => import("./weather-chart-client").then((module) => module.WeatherChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] w-full animate-pulse rounded-2xl border bg-muted/30" />
    ),
  },
);
