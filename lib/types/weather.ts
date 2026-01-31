export type WeatherHourly = {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  apparent_temperature: number[];
};

export type WeatherDaily = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
};

export type WeatherResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly?: WeatherHourly;
  daily?: WeatherDaily;
};
