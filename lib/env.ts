import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_MAPTILER_KEY: z.string().min(1),
  NEXT_PUBLIC_OPENWEATHER_KEY: z.string().min(1),
  NEXT_PUBLIC_MAP_STYLE_LIGHT: z.string().url().optional(),
  NEXT_PUBLIC_DEFAULT_CITY: z.string().default("tokyo"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_MAPTILER_KEY: process.env.NEXT_PUBLIC_MAPTILER_KEY,
  NEXT_PUBLIC_OPENWEATHER_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_KEY,
  NEXT_PUBLIC_MAP_STYLE_LIGHT: process.env.NEXT_PUBLIC_MAP_STYLE_LIGHT,
  NEXT_PUBLIC_DEFAULT_CITY: process.env.NEXT_PUBLIC_DEFAULT_CITY,
});
