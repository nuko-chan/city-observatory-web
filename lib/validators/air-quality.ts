import { z } from "zod";

export const AirQualityHourlySchema = z.object({
  time: z.array(z.string()),
  pm10: z.array(z.number().nullable()),
  pm2_5: z.array(z.number().nullable()),
  nitrogen_dioxide: z.array(z.number().nullable()),
  ozone: z.array(z.number().nullable()),
});

export const AirQualityResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  utc_offset_seconds: z.number(),
  hourly: AirQualityHourlySchema,
});
