export type AirQualityHourly = {
  time: string[];
  pm10: number[];
  pm2_5: number[];
  nitrogen_dioxide: number[];
  ozone: number[];
};

export type AirQualityResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: AirQualityHourly;
};
