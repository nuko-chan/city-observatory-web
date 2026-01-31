import { z } from "zod";

export const WeatherHourlySchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number()),
  relative_humidity_2m: z.array(z.number()),
  precipitation_probability: z.array(z.number()),
  wind_speed_10m: z.array(z.number()),
  apparent_temperature: z.array(z.number()),
});

export const WeatherDailySchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_sum: z.array(z.number()),
  precipitation_probability_max: z.array(z.number()),
});

export const WeatherResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  hourly: WeatherHourlySchema.optional(),
  daily: WeatherDailySchema.optional(),
});
