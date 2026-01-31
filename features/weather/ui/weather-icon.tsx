import type { ComponentProps } from "react";
import {
  Cloud,
  CloudAlert,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";
import type { WeatherIconKey } from "@/lib/domain/weather-classification";
import { cn } from "@/lib/utils";

type WeatherIconProps = {
  iconKey: WeatherIconKey;
  label?: string;
} & Omit<ComponentProps<"svg">, "children">;

const weatherIconMap: Record<WeatherIconKey, typeof Sun> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-drizzle": CloudDrizzle,
  "cloud-rain": CloudRain,
  "cloud-snow": CloudSnow,
  "cloud-lightning": CloudLightning,
  "cloud-alert": CloudAlert,
};

export function WeatherIcon({
  iconKey,
  label,
  className,
  ...props
}: WeatherIconProps) {
  const Icon = weatherIconMap[iconKey] ?? Cloud;
  return (
    <Icon
      className={cn("h-5 w-5 text-foreground/80", className)}
      aria-label={label}
      role={label ? "img" : "presentation"}
      {...props}
    />
  );
}
