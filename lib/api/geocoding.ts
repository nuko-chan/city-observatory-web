import { APIError, handleAPIError } from "./errors";
import { GeocodingResponseSchema } from "@/lib/validators/location";
import type { Location } from "@/lib/types/location";

export async function searchCities(query: string): Promise<Location[]> {
  if (query.length < 2) return [];

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "ja");
  url.searchParams.set("format", "json");

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new APIError(
        `Geocoding API error: ${response.statusText}`,
        response.status,
      );
    }

    const data = await response.json();
    const parsed = GeocodingResponseSchema.parse(data);

    return (parsed.results ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country,
      lat: item.latitude,
      lon: item.longitude,
      timezone: item.timezone,
      elevation: item.elevation,
    }));
  } catch (error) {
    throw handleAPIError(error);
  }
}
