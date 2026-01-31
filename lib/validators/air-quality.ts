import { z } from "zod";

export const AirQualityHourlySchema = z.object({
  time: z.array(z.string()),
  pm10: z.array(z.number()),
  pm2_5: z.array(z.number()),
  nitrogen_dioxide: z.array(z.number()),
  ozone: z.array(z.number()),
});

export const AirQualityResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  hourly: AirQualityHourlySchema,
});
