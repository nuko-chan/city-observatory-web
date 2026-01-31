import type {
  AirQualityHourly,
  AirQualityHourlyRaw,
  AirQualityResponse,
  AirQualityResponseRaw,
} from "@/lib/types/air-quality";

function buildValidIndexes(hourly: AirQualityHourlyRaw) {
  const maxLength = Math.min(
    hourly.time.length,
    hourly.pm10.length,
    hourly.pm2_5.length,
    hourly.nitrogen_dioxide.length,
    hourly.ozone.length,
  );

  const indexes: number[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    if (
      hourly.pm10[index] == null ||
      hourly.pm2_5[index] == null ||
      hourly.nitrogen_dioxide[index] == null ||
      hourly.ozone[index] == null
    ) {
      continue;
    }
    if (!hourly.time[index]) continue;
    indexes.push(index);
  }

  return indexes;
}

function pickValues(values: Array<number | null>, indexes: number[]) {
  return indexes
    .map((index) => values[index])
    .filter((value): value is number => value != null);
}

function normalizeHourly(hourly: AirQualityHourlyRaw): AirQualityHourly {
  const indexes = buildValidIndexes(hourly);

  return {
    time: indexes.map((index) => hourly.time[index]),
    pm10: pickValues(hourly.pm10, indexes),
    pm2_5: pickValues(hourly.pm2_5, indexes),
    nitrogen_dioxide: pickValues(hourly.nitrogen_dioxide, indexes),
    ozone: pickValues(hourly.ozone, indexes),
  };
}

export function normalizeAirQualityResponse(
  raw: AirQualityResponseRaw,
): AirQualityResponse {
  return {
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    utc_offset_seconds: raw.utc_offset_seconds,
    hourly: normalizeHourly(raw.hourly),
  };
}
