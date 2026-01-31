import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/lib/api/geocoding";
import { useDebounce } from "@/hooks/use-debounce";

export function useCitySearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => searchCities(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
}
