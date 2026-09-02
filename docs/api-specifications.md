# City Observatory - API 仕様書

[← README に戻る](../README.md)

外部 API のエンドポイント・パラメータ・レスポンス形式のリファレンス。

実装コードは `lib/api/`, `lib/validators/` を参照。

---

## 1. Open-Meteo Geocoding API

- **エンドポイント**: `GET https://geocoding-api.open-meteo.com/v1/search`
- **認証**: 不要（非商用利用）
- **ドキュメント**: https://open-meteo.com/en/docs/geocoding-api
- **実装**: `lib/api/geocoding.ts`

### パラメータ

| パラメータ | 型     | 必須 | 説明                               | デフォルト |
| ---------- | ------ | ---- | ---------------------------------- | ---------- |
| `name`     | string | ✓    | 検索する都市名（日本語・英語対応） | -          |
| `count`    | number | -    | 返却する候補数（最大 100）         | 10         |
| `language` | string | -    | 表示言語                           | `en`       |
| `format`   | string | -    | レスポンス形式                     | `json`     |

### レスポンス例

```json
{
  "results": [
    {
      "id": 1850144,
      "name": "Tokyo",
      "latitude": 35.6895,
      "longitude": 139.69171,
      "elevation": 40.0,
      "timezone": "Asia/Tokyo",
      "country": "Japan",
      "country_code": "JP"
    }
  ]
}
```

---

## 2. Open-Meteo Weather Forecast API

- **エンドポイント**: `GET https://api.open-meteo.com/v1/forecast`
- **認証**: 不要（非商用利用、商用は有料）
- **ドキュメント**: https://open-meteo.com/en/docs
- **実装**: `lib/api/weather.ts`

### パラメータ

| パラメータ      | 型     | 必須 | 説明               | デフォルト |
| --------------- | ------ | ---- | ------------------ | ---------- |
| `latitude`      | number | ✓    | 緯度               | -          |
| `longitude`     | number | ✓    | 経度               | -          |
| `hourly`        | string | -    | 時間ごとの気象要素 | -          |
| `daily`         | string | -    | 日ごとの気象要素   | -          |
| `timezone`      | string | -    | タイムゾーン       | `GMT`      |
| `forecast_days` | number | -    | 予報日数（1-16）   | 7          |

### 使用中の Hourly パラメータ

`temperature_2m`, `relative_humidity_2m`, `precipitation_probability`, `wind_speed_10m`, `apparent_temperature`, `weathercode`, `wind_direction_10m`, `uv_index`, `precipitation`

### 使用中の Daily パラメータ

`temperature_2m_max`, `temperature_2m_min`, `precipitation_sum`, `precipitation_probability_max`, `sunrise`, `sunset`, `uv_index_max`

---

## 3. Open-Meteo Air Quality API

- **エンドポイント**: `GET https://air-quality-api.open-meteo.com/v1/air-quality`
- **認証**: 不要
- **ドキュメント**: https://open-meteo.com/en/docs/air-quality-api
- **実装**: `lib/api/air-quality.ts`

### パラメータ

| パラメータ      | 型     | 必須 | 説明                 | デフォルト |
| --------------- | ------ | ---- | -------------------- | ---------- |
| `latitude`      | number | ✓    | 緯度                 | -          |
| `longitude`     | number | ✓    | 経度                 | -          |
| `hourly`        | string | -    | 時間ごとの大気質要素 | -          |
| `timezone`      | string | -    | タイムゾーン         | `GMT`      |
| `forecast_days` | number | -    | 予報日数（1-5）      | 5          |

### 使用中の Hourly パラメータ

`pm10`, `pm2_5`, `nitrogen_dioxide`, `ozone`

### PM2.5 簡易分類（設計判断）

厳密な AQI は採用せず、PM2.5 ベースの簡易ラベルで運用（ポートフォリオ用途のため）。

| PM2.5（μg/m³） | ラベル | 表示 |
| -------------- | ------ | ---- |
| 0 - 12         | 良い   | 良好 |
| 12.1 - 35.4    | 注意   | 普通 |
| 35.5 - 55.4    | 悪い   | 注意 |
| 55.5+          | 危険   | 警戒 |

実装: `lib/domain/air-quality-label.ts`

---

## 4. MapTiler Vector Tiles

- **ベース URL**: `https://api.maptiler.com`
- **認証**: API キー必須（`NEXT_PUBLIC_MAPTILER_KEY`）
- **レート制限**: Free プラン - 100,000 タイル/月
- **ドキュメント**: https://docs.maptiler.com/
- **実装**: `features/map/ui/map-view-client.tsx`

### スタイル URL

| スタイル                  | URL                                                                     |
| ------------------------- | ----------------------------------------------------------------------- |
| MIERUNE Streets（日本語） | `https://api.maptiler.com/maps/jp-mierune-streets/style.json?key={KEY}` |

### API キー保護

MapTiler Dashboard で **Allowed HTTP Origins** を設定:

- DEV: `http://localhost:3000`, `https://*.vercel.app`
- PROD: 本番 URL のみ

---

## 5. OpenWeatherMap Precipitation Tiles

- **タイル URL**: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={KEY}`
- **認証**: API キー必須（`NEXT_PUBLIC_OPENWEATHER_KEY`）

---

## 6. エラーハンドリング方針

| ステータス    | 対応                           |
| ------------- | ------------------------------ |
| 200           | 正常処理                       |
| 400           | パラメータエラー表示           |
| 429           | リトライせず、待機を案内       |
| 500/503       | 再試行ボタン表示               |
| Network Error | 「接続を確認してください」表示 |

---

## 7. 利用規約

- **Open-Meteo**: 非商用利用のみ。クレジット表記必須。過剰リクエスト禁止
- **MapTiler**: Allowed HTTP Origins 必須。Free プランはロゴ + クレジット表記。プリフェッチ禁止
- **OpenStreetMap**: クレジット表記必須（リンク付き）

---

**最終更新**: 2026-09-02
**バージョン**: 2.1
