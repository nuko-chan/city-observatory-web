import { useMemo } from "react";
import type { WeatherDaily, WeatherHourly } from "@/lib/types/weather";
import { getWeatherClassification } from "@/lib/domain/weather-classification";
import { getUVClassification } from "@/lib/domain/uv-classification";
import {
  getWindDirectionLabel,
  getWindDirectionRotation,
} from "@/lib/domain/wind-direction";
import {
  getSunPhase,
  getSunPhaseBackground,
  getSunPhaseLabel,
  getSunProgress,
} from "@/lib/domain/sun-path";
import { toUtcDateFromLocalTime } from "@/lib/utils/timezone";

function findClosestIndex(times: string[], utcOffsetSeconds?: number) {
  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const value = toUtcDateFromLocalTime(time, utcOffsetSeconds)?.getTime();
    if (!value) return;
    const diff = Math.abs(value - now);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return bestIndex;
}

type WeatherSnapshotInput = {
  hourly: WeatherHourly | undefined;
  daily: WeatherDaily | undefined;
  timeZone: string;
  utcOffsetSeconds?: number;
};

export function useWeatherSnapshot({
  hourly,
  daily,
  timeZone,
  utcOffsetSeconds,
}: WeatherSnapshotInput) {
  return useMemo(() => {
    if (!hourly) return undefined;
    const index = findClosestIndex(hourly.time, utcOffsetSeconds);
    const snapshot = {
      temperature: hourly.temperature_2m[index],
      apparentTemperature: hourly.apparent_temperature[index],
      humidity: hourly.relative_humidity_2m[index],
      windSpeed: hourly.wind_speed_10m[index],
      windDirection: hourly.wind_direction_10m[index],
      weathercode: hourly.weathercode[index],
      uvIndex: hourly.uv_index[index],
      precipitationProbability: hourly.precipitation_probability[index],
    };

    const weatherClassification = getWeatherClassification(
      snapshot.weathercode,
    );
    const uvClassification = getUVClassification(snapshot.uvIndex);
    const uvIndexMax = daily?.uv_index_max?.[0];
    const windDirectionLabel = getWindDirectionLabel(snapshot.windDirection);
    const windDirectionRotation = getWindDirectionRotation(
      snapshot.windDirection,
    );
    const sunriseAtRaw = daily?.sunrise?.[0];
    const sunsetAtRaw = daily?.sunset?.[0];
    const sunriseAt = sunriseAtRaw
      ? toUtcDateFromLocalTime(sunriseAtRaw, utcOffsetSeconds)
      : undefined;
    const sunsetAt = sunsetAtRaw
      ? toUtcDateFromLocalTime(sunsetAtRaw, utcOffsetSeconds)
      : undefined;
    const sunPhase =
      sunriseAt && sunsetAt
        ? getSunPhase(new Date(), sunriseAt, sunsetAt)
        : "night";
    const sunProgress =
      sunriseAt && sunsetAt
        ? getSunProgress(new Date(), sunriseAt, sunsetAt)
        : 0;
    const sunPhaseLabel = getSunPhaseLabel(sunPhase);
    const sunPhaseBackground = getSunPhaseBackground(sunPhase);

    return {
      snapshot,
      weatherClassification,
      uvClassification,
      uvIndexMax,
      windDirectionLabel,
      windDirectionRotation,
      sunriseAt,
      sunsetAt,
      sunPhaseLabel,
      sunPhaseBackground,
      sunProgress,
      timeZone,
    };
  }, [daily, hourly, timeZone, utcOffsetSeconds]);
}
