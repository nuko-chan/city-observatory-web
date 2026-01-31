import { z } from "zod";

export const GeocodingLocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  elevation: z.number().optional(),
  timezone: z.string(),
  country: z.string(),
  country_code: z.string().optional(),
});

export const GeocodingResponseSchema = z.object({
  results: z.array(GeocodingLocationSchema).optional(),
  generationtime_ms: z.number().optional(),
});
