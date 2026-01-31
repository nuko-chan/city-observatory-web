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

function findClosestIndex(times: string[]) {
  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  times.forEach((time, index) => {
    const value = new Date(time).getTime();
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
};

export function useWeatherSnapshot({
  hourly,
  daily,
  timeZone,
}: WeatherSnapshotInput) {
  return useMemo(() => {
    if (!hourly) return undefined;
    const index = findClosestIndex(hourly.time);
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
    const sunriseAt = daily?.sunrise?.[0];
    const sunsetAt = daily?.sunset?.[0];
    const sunPhase =
      sunriseAt && sunsetAt
        ? getSunPhase(new Date(), new Date(sunriseAt), new Date(sunsetAt))
        : "night";
    const sunProgress =
      sunriseAt && sunsetAt
        ? getSunProgress(new Date(), new Date(sunriseAt), new Date(sunsetAt))
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
  }, [daily, hourly, timeZone]);
}
