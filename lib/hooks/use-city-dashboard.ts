"use client";

import { useMemo } from "react";
import { useWeatherData } from "@/features/weather/model/use-weather-data";
import { useWeatherSnapshot } from "@/features/weather/model/use-weather-snapshot";
import { useAirQualityData } from "@/features/air-quality/model/use-air-quality-data";
import { getAirQualitySeries } from "@/lib/domain/air-quality-series";
import { getAirQualitySnapshot } from "@/lib/domain/air-quality-snapshot";
import { calculateComfortScore } from "@/lib/domain/comfort-score";
import { calculateOutdoorRisk } from "@/lib/domain/outdoor-risk";
import { temperatureToColor } from "@/lib/utils/formatting";
import type { City } from "@/lib/constants/cities";

export function useCityDashboard(city: City) {
  const weatherQuery = useWeatherData(city, "24h");
  const airQuery = useAirQualityData(city, "24h");

  const weatherView = useWeatherSnapshot({
    hourly: weatherQuery.data?.hourly,
    daily: weatherQuery.data?.daily,
    timeZone: weatherQuery.data?.timezone ?? city.timezone,
    utcOffsetSeconds: weatherQuery.data?.utc_offset_seconds,
  });

  const airSnapshot = useMemo(
    () =>
      getAirQualitySnapshot(
        airQuery.data?.hourly,
        undefined,
        airQuery.data?.utc_offset_seconds,
      ),
    [airQuery.data],
  );

  const comfortScore = calculateComfortScore({
    temperature: weatherView?.snapshot.temperature ?? 0,
    humidity: weatherView?.snapshot.humidity ?? 0,
    windSpeed: weatherView?.snapshot.windSpeed ?? 0,
    precipitationProbability:
      weatherView?.snapshot.precipitationProbability ?? 0,
    pm25: airSnapshot?.pm25 ?? 0,
  });

  const outdoorRiskLevel = calculateOutdoorRisk({
    precipitationProbability:
      weatherView?.snapshot.precipitationProbability ?? 0,
    windSpeed: weatherView?.snapshot.windSpeed ?? 0,
    pm25: airSnapshot?.pm25 ?? 0,
  });

  const airSeries = useMemo(
    () => getAirQualitySeries(airQuery.data?.hourly, "24h"),
    [airQuery.data],
  );

  const bgColor = temperatureToColor(weatherView?.snapshot.temperature ?? 20);

  return {
    weatherQuery,
    airQuery,
    weatherView,
    airSnapshot,
    comfortScore,
    outdoorRiskLevel,
    airSeries,
    bgColor,
  };
}
