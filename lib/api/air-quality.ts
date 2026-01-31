import { APIError, handleAPIError } from "./errors";
import { AirQualityResponseSchema } from "@/lib/validators/air-quality";
import type { AirQualityResponse } from "@/lib/types/air-quality";

export async function getAirQualityForecast(
  lat: number,
  lon: number,
  range: "24h" | "5d",
): Promise<AirQualityResponse> {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set("hourly", "pm10,pm2_5,nitrogen_dioxide,ozone");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", range === "24h" ? "1" : "5");

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new APIError(
        `Air Quality API error: ${response.statusText}`,
        response.status,
      );
    }

    const data = await response.json();
    return AirQualityResponseSchema.parse(data);
  } catch (error) {
    throw handleAPIError(error);
  }
}
