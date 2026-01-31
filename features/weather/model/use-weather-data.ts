import { useQuery } from "@tanstack/react-query";
import { APIError, handleAPIError } from "@/lib/api/errors";
import { getWeatherForecast } from "@/lib/api/weather";
import type { Location } from "@/lib/types/location";

export function useWeatherData(
  location: Location | undefined,
  range: "24h" | "7d",
) {
  return useQuery({
    queryKey: ["weather", location?.id, range],
    queryFn: async () => {
      if (!location) throw new Error("Location is required");
      try {
        return await getWeatherForecast(location.lat, location.lon, range);
      } catch (error) {
        throw handleAPIError(error);
      }
    },
    enabled: Boolean(location),
    staleTime: 15 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof APIError && error.status === 429) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
