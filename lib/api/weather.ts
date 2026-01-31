import { APIError, handleAPIError } from "./errors";
import { WeatherResponseSchema } from "@/lib/validators/weather";
import type { WeatherResponse } from "@/lib/types/weather";

export async function getWeatherForecast(
  lat: number,
  lon: number,
  range: "24h" | "7d",
): Promise<WeatherResponse> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,apparent_temperature",
  );
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", range === "24h" ? "1" : "7");

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new APIError(
        `Weather API error: ${response.statusText}`,
        response.status,
      );
    }

    const data = await response.json();
    return WeatherResponseSchema.parse(data);
  } catch (error) {
    throw handleAPIError(error);
  }
}
