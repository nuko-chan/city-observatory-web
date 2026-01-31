import type { Location } from "@/lib/types/location";

export type City = Location & { label: string };

export const cities: City[] = [
  {
    id: 1850144,
    name: "Tokyo",
    label: "東京",
    country: "Japan",
    lat: 35.6895,
    lon: 139.6917,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1853909,
    name: "Osaka",
    label: "大阪",
    country: "Japan",
    lat: 34.6937,
    lon: 135.5023,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1856057,
    name: "Nagoya",
    label: "名古屋",
    country: "Japan",
    lat: 35.1815,
    lon: 136.9066,
    timezone: "Asia/Tokyo",
  },
  {
    id: 2128295,
    name: "Sapporo",
    label: "札幌",
    country: "Japan",
    lat: 43.0618,
    lon: 141.3545,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1863967,
    name: "Fukuoka",
    label: "福岡",
    country: "Japan",
    lat: 33.5904,
    lon: 130.4017,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1856035,
    name: "Naha",
    label: "那覇",
    country: "Japan",
    lat: 26.2124,
    lon: 127.6809,
    timezone: "Asia/Tokyo",
  },
];
