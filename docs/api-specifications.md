# City Observatory - API 仕様書

このドキュメントは、City Observatory で使用する外部 API の詳細仕様をまとめたものです。

---

## 1. Open-Meteo Geocoding API

### 1.1 概要

都市名から地理情報（緯度・経度・タイムゾーン等）を取得する API です。

### 1.2 基本情報

- **ベース URL**: `https://geocoding-api.open-meteo.com/v1`
- **認証**: 不要（非商用利用）
- **レート制限**: 明記なし（過剰利用は禁止）
- **データ形式**: JSON
- **ドキュメント**: https://open-meteo.com/en/docs/geocoding-api

### 1.3 エンドポイント: `/search`

#### リクエスト

```
GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=10&language=ja&format=json
```

#### パラメータ

| パラメータ | 型     | 必須 | 説明                                   | デフォルト |
| ---------- | ------ | ---- | -------------------------------------- | ---------- |
| `name`     | string | ✓    | 検索する都市名（日本語・英語対応）     | -          |
| `count`    | number | -    | 返却する候補数（最大 100）             | 10         |
| `language` | string | -    | 表示言語（`ja`, `en`等）               | `en`       |
| `format`   | string | -    | レスポンス形式（`json` or `protobuf`） | `json`     |

#### レスポンス例

```json
{
  "results": [
    {
      "id": 1850144,
      "name": "Tokyo",
      "latitude": 35.6895,
      "longitude": 139.69171,
      "elevation": 40.0,
      "feature_code": "PPLC",
      "country_code": "JP",
      "admin1_id": 1850147,
      "admin2_id": 1850144,
      "admin3_id": 7279570,
      "timezone": "Asia/Tokyo",
      "population": 8336599,
      "country_id": 1861060,
      "country": "Japan",
      "admin1": "Tōkyō",
      "admin2": "Tokyo",
      "admin3": "Tokyo"
    },
    ...
  ],
  "generationtime_ms": 2.5
}
```

#### レスポンスフィールド

| フィールド     | 型     | 説明                           |
| -------------- | ------ | ------------------------------ |
| `id`           | number | GeoNames ID（一意識別子）      |
| `name`         | string | 都市名（英語）                 |
| `latitude`     | number | 緯度（-90 〜 90）              |
| `longitude`    | number | 経度（-180 〜 180）            |
| `elevation`    | number | 標高（メートル）               |
| `timezone`     | string | タイムゾーン（IANA 形式）      |
| `country`      | string | 国名                           |
| `country_code` | string | 国コード（ISO 3166-1 alpha-2） |
| `population`   | number | 人口                           |
| `admin1`       | string | 第 1 行政区（都道府県等）      |

#### エラーレスポンス

```json
{
  "error": true,
  "reason": "Parameter 'name' is required"
}
```

### 1.4 実装例（TypeScript）

```typescript
// lib/validators/location.ts
import { z } from "zod";

// Zodスキーマ
const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  elevation: z.number().optional(),
  timezone: z.string(),
  country: z.string(),
  country_code: z.string(),
});

const GeocodingResponseSchema = z.object({
  results: z.array(LocationSchema).optional(),
  generationtime_ms: z.number().optional(),
});

// lib/api/geocoding.ts
import { APIError } from "./errors";
import { GeocodingResponseSchema } from "../lib/validators/location";

// トップレベル関数はfunction宣言（coding-guidelines準拠）
export async function searchCities(query: string) {
  if (query.length < 2) {
    return [];
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "ja");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new APIError(
      `Geocoding API error: ${response.statusText}`,
      response.status,
    );
  }

  const data = await response.json();
  const parsed = GeocodingResponseSchema.parse(data);

  return parsed.results || [];
}
```

---

## 2. Open-Meteo Weather Forecast API

### 2.1 概要

指定地点の天気予報データを取得する API です。

### 2.2 基本情報

- **ベース URL**: `https://api.open-meteo.com/v1`
- **認証**: 不要（非商用利用）
- **レート制限**: 明記なし（商用は有料プラン必須）
- **データ形式**: JSON
- **ドキュメント**: https://open-meteo.com/en/docs

### 2.3 エンドポイント: `/forecast`

#### リクエスト

```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly={hourly_params}&daily={daily_params}&timezone=auto&forecast_days={days}
```

#### パラメータ

| パラメータ      | 型     | 必須 | 説明                                          | デフォルト |
| --------------- | ------ | ---- | --------------------------------------------- | ---------- |
| `latitude`      | number | ✓    | 緯度（-90 〜 90）                             | -          |
| `longitude`     | number | ✓    | 経度（-180 〜 180）                           | -          |
| `hourly`        | string | -    | 時間ごとの気象要素（カンマ区切り）            | -          |
| `daily`         | string | -    | 日ごとの気象要素（カンマ区切り）              | -          |
| `timezone`      | string | -    | タイムゾーン（`auto`, `GMT`, `Asia/Tokyo`等） | `GMT`      |
| `forecast_days` | number | -    | 予報日数（1-16）                              | 7          |
| `past_days`     | number | -    | 過去データ日数（0-92）                        | 0          |

#### 時間ごとの気象要素（`hourly`）

本アプリで使用する主要パラメータ:

- `temperature_2m`: 気温（℃、地上 2m）
- `relative_humidity_2m`: 相対湿度（%）
- `precipitation_probability`: 降水確率（%）
- `precipitation`: 降水量（mm）
- `wind_speed_10m`: 風速（m/s、地上 10m）
- `apparent_temperature`: 体感温度（℃）
- `weathercode`: 天気コード（WMO 準拠）

#### 日ごとの気象要素（`daily`）

- `temperature_2m_max`: 最高気温（℃）
- `temperature_2m_min`: 最低気温（℃）
- `precipitation_sum`: 降水量合計（mm）
- `precipitation_probability_max`: 最大降水確率（%）
- `sunrise`: 日の出時刻（ISO8601）
- `sunset`: 日の入り時刻（ISO8601）

#### リクエスト例（24 時間予報）

```
GET https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,apparent_temperature&timezone=auto&forecast_days=1
```

#### レスポンス例

```json
{
  "latitude": 35.6895,
  "longitude": 139.69171,
  "generationtime_ms": 0.5,
  "utc_offset_seconds": 32400,
  "timezone": "Asia/Tokyo",
  "timezone_abbreviation": "JST",
  "elevation": 40.0,
  "hourly_units": {
    "time": "iso8601",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "precipitation_probability": "%",
    "wind_speed_10m": "m/s",
    "apparent_temperature": "°C"
  },
  "hourly": {
    "time": [
      "2026-01-31T00:00",
      "2026-01-31T01:00",
      ...
    ],
    "temperature_2m": [8.5, 8.2, 7.9, ...],
    "relative_humidity_2m": [65, 67, 68, ...],
    "precipitation_probability": [10, 15, 20, ...],
    "wind_speed_10m": [2.5, 2.3, 2.1, ...],
    "apparent_temperature": [6.5, 6.2, 5.8, ...]
  },
  "daily_units": {
    "time": "iso8601",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "precipitation_sum": "mm",
    "precipitation_probability_max": "%"
  },
  "daily": {
    "time": ["2026-01-31"],
    "temperature_2m_max": [12.5],
    "temperature_2m_min": [6.2],
    "precipitation_sum": [2.5],
    "precipitation_probability_max": [60]
  }
}
```

#### エラーレスポンス

```json
{
  "error": true,
  "reason": "Parameter 'latitude' is required"
}
```

### 2.4 実装例（TypeScript）

```typescript
// lib/validators/weather.ts
import { z } from "zod";

// Zodスキーマ
const WeatherHourlySchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number()),
  relative_humidity_2m: z.array(z.number()),
  precipitation_probability: z.array(z.number()),
  wind_speed_10m: z.array(z.number()),
  apparent_temperature: z.array(z.number()),
});

const WeatherDailySchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_sum: z.array(z.number()),
  precipitation_probability_max: z.array(z.number()),
});

const WeatherResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  hourly: WeatherHourlySchema.optional(),
  daily: WeatherDailySchema.optional(),
});

// lib/api/weather.ts
import { APIError } from "./errors";
import { WeatherResponseSchema } from "../lib/validators/weather";

// トップレベル関数はfunction宣言（coding-guidelines準拠）
export async function getWeatherForecast(
  lat: number,
  lon: number,
  range: "24h" | "7d",
) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,apparent_temperature",
  );
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", range === "24h" ? "1" : "7");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new APIError(
      `Weather API error: ${response.statusText}`,
      response.status,
    );
  }

  const data = await response.json();
  return WeatherResponseSchema.parse(data);
}
```

---

## 3. Open-Meteo Air Quality API

### 3.1 概要

指定地点の大気質予報データを取得する API です。

### 3.2 基本情報

- **ベース URL**: `https://air-quality-api.open-meteo.com/v1`
- **認証**: 不要（非商用利用）
- **レート制限**: 明記なし
- **データ形式**: JSON
- **ドキュメント**: https://open-meteo.com/en/docs/air-quality-api

### 3.3 エンドポイント: `/air-quality`

#### リクエスト

```
GET https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&hourly={hourly_params}&timezone=auto&forecast_days={days}
```

#### パラメータ

| パラメータ      | 型     | 必須 | 説明                                 | デフォルト |
| --------------- | ------ | ---- | ------------------------------------ | ---------- |
| `latitude`      | number | ✓    | 緯度（-90 〜 90）                    | -          |
| `longitude`     | number | ✓    | 経度（-180 〜 180）                  | -          |
| `hourly`        | string | -    | 時間ごとの大気質要素（カンマ区切り） | -          |
| `timezone`      | string | -    | タイムゾーン                         | `GMT`      |
| `forecast_days` | number | -    | 予報日数（1-5）                      | 5          |

#### 時間ごとの大気質要素（`hourly`）

本アプリで使用する主要パラメータ:

- `pm10`: PM10 濃度（μg/m³）
- `pm2_5`: PM2.5 濃度（μg/m³）
- `nitrogen_dioxide`: 二酸化窒素濃度（μg/m³）
- `ozone`: オゾン濃度（μg/m³）
- `sulphur_dioxide`: 二酸化硫黄濃度（μg/m³）
- `carbon_monoxide`: 一酸化炭素濃度（μg/m³）

#### リクエスト例

```
GET https://air-quality-api.open-meteo.com/v1/air-quality?latitude=35.6895&longitude=139.6917&hourly=pm10,pm2_5,nitrogen_dioxide,ozone&timezone=auto&forecast_days=1
```

#### レスポンス例

```json
{
  "latitude": 35.6895,
  "longitude": 139.69171,
  "generationtime_ms": 1.2,
  "utc_offset_seconds": 32400,
  "timezone": "Asia/Tokyo",
  "timezone_abbreviation": "JST",
  "elevation": 40.0,
  "hourly_units": {
    "time": "iso8601",
    "pm10": "μg/m³",
    "pm2_5": "μg/m³",
    "nitrogen_dioxide": "μg/m³",
    "ozone": "μg/m³"
  },
  "hourly": {
    "time": [
      "2026-01-31T00:00",
      "2026-01-31T01:00",
      ...
    ],
    "pm10": [25.5, 24.8, 23.2, ...],
    "pm2_5": [12.5, 11.9, 11.2, ...],
    "nitrogen_dioxide": [35.2, 33.8, 32.5, ...],
    "ozone": [45.8, 46.2, 47.1, ...]
  }
}
```

### 3.4 AQI 分類（参考）

PM2.5 濃度に基づく AQI（Air Quality Index）の一般的な分類:

| PM2.5 濃度（μg/m³） | AQI 分類                       | レベル           |
| ------------------- | ------------------------------ | ---------------- |
| 0 - 12              | Good                           | 良好             |
| 12.1 - 35.4         | Moderate                       | 普通             |
| 35.5 - 55.4         | Unhealthy for Sensitive Groups | 敏感な人に影響   |
| 55.5 - 150.4        | Unhealthy                      | 健康に影響       |
| 150.5 - 250.4       | Very Unhealthy                 | 非常に健康に影響 |
| 250.5+              | Hazardous                      | 危険             |

### 3.5 実装例（TypeScript）

```typescript
// lib/validators/air-quality.ts
import { z } from "zod";

// Zodスキーマ
const AirQualityHourlySchema = z.object({
  time: z.array(z.string()),
  pm10: z.array(z.number()),
  pm2_5: z.array(z.number()),
  nitrogen_dioxide: z.array(z.number()),
  ozone: z.array(z.number()),
});

const AirQualityResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  hourly: AirQualityHourlySchema,
});

// lib/api/air-quality.ts
import { APIError } from "./errors";
import { AirQualityResponseSchema } from "../lib/validators/air-quality";

// トップレベル関数はfunction宣言（coding-guidelines準拠）
export async function getAirQualityForecast(
  lat: number,
  lon: number,
  range: "24h" | "5d",
) {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set("hourly", "pm10,pm2_5,nitrogen_dioxide,ozone");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", range === "24h" ? "1" : "5");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new APIError(
      `Air Quality API error: ${response.statusText}`,
      response.status,
    );
  }

  const data = await response.json();
  return AirQualityResponseSchema.parse(data);
}

// lib/domain/aqi-classification.ts
// トップレベル関数はfunction宣言（coding-guidelines準拠）
export function classifyAQI(
  pm25: number,
): "good" | "moderate" | "unhealthy" | "hazardous" {
  if (pm25 <= 12) return "good";
  if (pm25 <= 35.4) return "moderate";
  if (pm25 <= 150.4) return "unhealthy";
  return "hazardous";
}
```

---

## 4. MapTiler Vector Tiles API

### 4.1 概要

地図タイルを取得するための API です。MapLibre GL JS と組み合わせて使用します。

### 4.2 基本情報

- **ベース URL**: `https://api.maptiler.com`
- **認証**: API キー必須（`NEXT_PUBLIC_MAPTILER_KEY`）
- **レート制限**: Free プラン - 100,000 タイル/月
- **データ形式**: Vector Tiles（Protocol Buffers）
- **ドキュメント**: https://docs.maptiler.com/

### 4.3 スタイル URL

#### Streets（ライト）

```
https://api.maptiler.com/maps/streets-v2/style.json?key={MAPTILER_KEY}
```

#### Streets Dark（ダーク）

```
https://api.maptiler.com/maps/streets-v2-dark/style.json?key={MAPTILER_KEY}
```

#### その他のスタイル

- Basic: `https://api.maptiler.com/maps/basic-v2/style.json?key={KEY}`
- Bright: `https://api.maptiler.com/maps/bright-v2/style.json?key={KEY}`
- Outdoor: `https://api.maptiler.com/maps/outdoor-v2/style.json?key={KEY}`
- Satellite: `https://api.maptiler.com/maps/hybrid/style.json?key={KEY}`

### 4.4 使用制限・保護

#### Allowed HTTP Origins（必須設定）

API キーを保護するため、MapTiler ダッシュボードで許可するオリジンを設定:

**開発用（DEV キー）**:

- `http://localhost:3000`
- `https://*.vercel.app`

**本番用（PROD キー）**:

- `https://city-observatory.vercel.app`（実際の本番 URL に置き換え）

#### 使用量監視

- MapTiler ダッシュボードで月間タイル数を確認
- アラート設定推奨（上限の 80%で通知等）

### 4.5 クレジット表記要件

#### OpenStreetMap（データソース）

```html
©
<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
```

#### MapTiler（タイル提供元）

```html
© <a href="https://www.maptiler.com/copyright/">MapTiler</a>
```

#### Free プランのロゴ表示

Free プランの場合、MapTiler ロゴの表示が必須:

```html
<a href="https://www.maptiler.com" target="_blank" rel="noopener noreferrer">
  <img
    src="https://api.maptiler.com/resources/logo.svg"
    alt="MapTiler logo"
    style="height: 24px;"
  />
</a>
```

### 4.6 実装例（TypeScript + MapLibre GL JS）

#### 環境変数から取得

```typescript
// lib/env.ts
import { env } from "@/lib/env";

const mapStyle = env.NEXT_PUBLIC_MAP_STYLE_LIGHT;
```

#### MapLibre 初期化

```typescript
// features/map/ui/map-view-client.tsx
"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { env } from "@/lib/env";

type MapViewClientProps = {
  center: [number, number];
  zoom: number;
};

// トップレベル関数はfunction宣言（coding-guidelines準拠）
export function MapViewClient({ center, zoom }: MapViewClientProps) {
  // undefinedを優先（coding-guidelines準拠）
  const mapContainer = useRef<HTMLDivElement | undefined>(undefined);
  const map = useRef<maplibregl.Map | undefined>(undefined);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: env.NEXT_PUBLIC_MAP_STYLE_LIGHT,
      center: center,
      zoom: zoom,
      attributionControl: true, // クレジット表示を有効化
    });

    // マーカー追加例
    new maplibregl.Marker({ color: "hsl(var(--primary))" })
      .setLngLat(center)
      .addTo(map.current);

    // クリーンアップは非トップレベル関数（アロー関数）
    return () => {
      map.current?.remove();
    };
  }, [center, zoom]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer as any} className="w-full h-full" />

      {/* MapTilerロゴ（Freeプラン必須） */}
      <div className="absolute bottom-2 left-2 z-10">
        <a
          href="https://www.maptiler.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.maptiler.com/resources/logo.svg"
            alt="MapTiler logo"
            className="h-6"
          />
        </a>
      </div>
    </div>
  );
}
```

---

## 5. API エラーハンドリング戦略

### 5.1 共通エラークラス

```typescript
// lib/api/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

// トップレベル関数はfunction宣言（coding-guidelines準拠）
export function handleAPIError(error: unknown): APIError {
  if (error instanceof Response) {
    return new APIError(error.statusText, error.status, `HTTP_${error.status}`);
  }
  if (error instanceof Error) {
    return new APIError(error.message);
  }
  return new APIError("Unknown error occurred");
}
```

### 5.2 HTTP ステータスコード別対応

| ステータス    | 説明                  | 対応                                                  |
| ------------- | --------------------- | ----------------------------------------------------- |
| 200           | 成功                  | 正常処理                                              |
| 400           | Bad Request           | パラメータエラー表示                                  |
| 429           | Too Many Requests     | リトライせず、エラー表示 + 「しばらく待ってください」 |
| 500           | Internal Server Error | 再試行ボタン表示                                      |
| 503           | Service Unavailable   | 「サービス一時停止中」表示                            |
| Network Error | ネットワークエラー    | 「インターネット接続を確認してください」表示          |

### 5.3 TanStack Query でのエラーハンドリング

```typescript
import { useQuery } from "@tanstack/react-query";

export function useWeatherData(location: Location | null, range: "24h" | "7d") {
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
    enabled: !!location,
    staleTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // 429エラーは再試行しない
      if (error?.status === 429) return false;
      // その他は2回まで再試行
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
  });
}
```

### 5.4 UI でのエラー表示

```typescript
// コンポーネント内
const { data, isLoading, error } = useWeatherData(location, range);

if (error) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <p className="text-muted-foreground">
        {error.status === 429
          ? "リクエストが多すぎます。しばらく待ってから再試行してください。"
          : "データの取得に失敗しました。"}
      </p>
      {error.status !== 429 && (
        <Button onClick={() => refetch()}>再試行</Button>
      )}
    </div>
  );
}
```

---

## 6. キャッシュ戦略

### 6.1 TanStack Query 設定

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分間は新鮮とみなす
      cacheTime: 10 * 60 * 1000, // 10分間キャッシュ保持
      retry: 2, // 失敗時2回まで再試行
      refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得無効
      refetchOnReconnect: true, // ネットワーク再接続時は再取得
    },
  },
});
```

### 6.2 データ種別ごとのキャッシュ期間

| データ種別 | staleTime | cacheTime | 理由                        |
| ---------- | --------- | --------- | --------------------------- |
| 都市検索   | 30 分     | 60 分     | 都市情報は変化しない        |
| 天気予報   | 15 分     | 30 分     | 更新頻度が高い              |
| 大気質予報 | 15 分     | 30 分     | 更新頻度が高い              |
| 派生指標   | -         | -         | 計算結果は useMemo でメモ化 |

### 6.3 手動リフレッシュ

```typescript
import { useQueryClient } from "@tanstack/react-query";

function RefreshButton({ city }: { city: string }) {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["weather", city] });
    queryClient.invalidateQueries({ queryKey: ["air-quality", city] });
  };

  return <Button onClick={handleRefresh}>データを更新</Button>;
}
```

---

## 7. API 使用上の注意事項

### 7.1 Open-Meteo 利用規約遵守

- **非商用利用のみ**: ポートフォリオ・研究・教育目的は可
- **商用利用の場合**: 有料プランへの移行が必須
- **過剰なリクエスト禁止**: キャッシュを活用し、不要なリクエストを避ける
- **クレジット表記**: UI に "Weather data by Open-Meteo.com" を表示

### 7.2 MapTiler 利用規約遵守

- **Allowed HTTP Origins 設定必須**: キーの盗用防止
- **使用量監視**: Free プラン上限（100,000 タイル/月）に注意
- **クレジット表記必須**: OSM + MapTiler + ロゴ（Free プラン）
- **プリフェッチ禁止**: タイルの事前一括ダウンロードは規約違反

### 7.3 レート制限対策

- **キャッシュの活用**: TanStack Query で適切な staleTime を設定
- **デバウンス**: 検索入力は 300ms 遅延させる
- **429 エラー時の処理**: 再試行せず、ユーザーに通知
- **更新間隔の固定**: 自動更新は最短 15 分間隔

---

## 8. API 仕様変更時の対応

### 8.1 監視方法

- Open-Meteo 公式ドキュメントの定期確認
- MapTiler Changelog の確認
- API レスポンスの Zod バリデーションエラー監視（Sentry 等）

### 8.2 変更時の影響範囲

1. **レスポンス構造変更**: Zod スキーマの更新
2. **エンドポイント変更**: API クライアントの URL 更新
3. **パラメータ追加/削除**: 実装の修正

### 8.3 後方互換性確保

- Zod スキーマで `.optional()` を活用（新規フィールド）
- デフォルト値を設定（`.default()`）
- フォールバック処理を実装

---

## 9. パフォーマンス最適化

### 9.1 並列リクエスト

```typescript
// ❌ Bad: 逐次実行
const weather = await getWeatherForecast(lat, lon, range);
const airQuality = await getAirQualityForecast(lat, lon, range);

// ✅ Good: 並列実行
const [weather, airQuality] = await Promise.all([
  getWeatherForecast(lat, lon, range),
  getAirQualityForecast(lat, lon, range),
]);
```

### 9.2 リクエストの最小化

- 必要なパラメータのみを取得（`hourly=temperature_2m,precipitation`等）
- 不要な日数は取得しない（24h 予報なら`forecast_days=1`）

### 9.3 プリフェッチ（任意）

```typescript
import { useQueryClient } from "@tanstack/react-query";

// ホバー時に次の都市データをプリフェッチ
function CityCard({ city }: { city: Location }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["weather", city.id, "24h"],
      queryFn: () => getWeatherForecast(city.lat, city.lon, "24h"),
    });
  };

  return <div onMouseEnter={handleMouseEnter}>...</div>;
}
```

---

## 10. まとめ

### 10.1 使用 API 一覧

| API                    | 用途       | 認証 | レート制限                |
| ---------------------- | ---------- | ---- | ------------------------- |
| Open-Meteo Geocoding   | 都市検索   | 不要 | 明記なし（過剰利用禁止）  |
| Open-Meteo Weather     | 天気予報   | 不要 | 明記なし（商用は有料）    |
| Open-Meteo Air Quality | 大気質予報 | 不要 | 明記なし                  |
| MapTiler Vector Tiles  | 地図タイル | 必須 | 100,000 タイル/月（Free） |

### 10.2 重要なベストプラクティス

- ✅ Zod でレスポンスを必ずバリデーション
- ✅ TanStack Query でキャッシュ・エラーハンドリング
- ✅ 429 エラーは再試行しない
- ✅ MapTiler API キーは環境変数＋ Allowed Origins 設定
- ✅ クレジット表記を忘れずに実装

---

**最終更新**: 2026-01-31
**作成者**: haru
**バージョン**: 1.0
