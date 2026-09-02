# City Observatory - 拡張機能仕様書

[← README に戻る](../README.md)

## 1. 概要

### 1.1 目的

既存のOpen-Meteo APIを活用し、**APIパラメータの追加のみ**で実装可能な視覚的インパクトの高い機能を追加する。

### 1.2 方針

- 既存APIの拡張のみ（新規APIキー不要、新規エンドポイント不要）
- 無料枠内で実装（リクエスト数増加なし）
- 一目で状況が伝わる見せ方を重視

### 1.3 APIの確実性

Open-Meteo公式ドキュメントで確認済み（https://open-meteo.com/en/docs）。WMO Weather Code標準に準拠。全パラメータが無料プランで利用可能。

---

## 2. 実装済み機能

### E1. 風向き・風速ビジュアライザー [実装済み]

- **ドメインロジック**: `lib/domain/wind-direction.ts`
- **UI**: `features/weather/ui/wind-card.tsx`
- **APIパラメータ**: `wind_direction_10m` (hourly)
- 風向き矢印をアニメーション表示、風速に応じて表現を変化

### E2. 天気コードによる背景・アイコン変化 [実装済み]

- **ドメインロジック**: `lib/domain/weather-classification.ts`
- **UI**: `features/weather/ui/weather-icon.tsx`
- **APIパラメータ**: `weathercode` (hourly)
- WMO天気コードに基づくアイコン・ラベル表示

**WMO天気コード対応表:**

| コード | 説明          | 日本語表示 |
| ------ | ------------- | ---------- |
| 0      | Clear sky     | 快晴       |
| 1      | Mainly clear  | 晴れ       |
| 2      | Partly cloudy | 薄曇り     |
| 3      | Overcast      | 曇り       |
| 45, 48 | Fog           | 霧         |
| 51-55  | Drizzle       | 霧雨〜小雨 |
| 61-65  | Rain          | 雨〜大雨   |
| 71-75  | Snowfall      | 雪〜大雪   |
| 80-82  | Rain showers  | にわか雨   |
| 85-86  | Snow showers  | にわか雪   |
| 95-99  | Thunderstorm  | 雷雨       |

### E3. 日の出/日の入り可視化 [実装済み]

- **ドメインロジック**: `lib/domain/sun-path.ts`
- **UI**: `features/weather/ui/sun-path-card.tsx`
- **APIパラメータ**: `sunrise`, `sunset` (daily)
- 太陽の軌道を円弧で表示、現在時刻の太陽位置を計算

### E4. UV指数カード [実装済み]

- **ドメインロジック**: `lib/domain/uv-classification.ts`
- **UI**: `features/weather/ui/uv-card.tsx`
- **APIパラメータ**: `uv_index` (hourly), `uv_index_max` (daily)

**UV指数の分類:**

| UV指数 | レベル     | 色       |
| ------ | ---------- | -------- |
| 0-2    | 低い       | 緑       |
| 3-5    | 中程度     | 黄       |
| 6-7    | 高い       | オレンジ |
| 8-10   | 非常に高い | 赤       |
| 11+    | 極端に高い | 紫       |

---

## 3. 未実装の拡張候補

### 優先度：中

#### E5. 降水量の実測値表示

- **APIパラメータ**: `precipitation` (hourly)
- 降水確率に加え、実際の降水量を表示。24時間累積降水量のグラフ化。

#### E6. 雲量アニメーション

- **APIパラメータ**: `cloud_cover` (hourly)
- SVG/CSSで雲を描画、雲量%に応じて数を調整。

#### E7. 気圧変化グラフ

- **APIパラメータ**: `pressure_msl` (hourly)
- Rechartsで折れ線グラフ、気圧の上昇/下降傾向を表示。

### 優先度：低

#### E8. 視程（霧）の可視化

- **APIパラメータ**: `visibility`

#### E9. 降雪アニメーション

- **APIパラメータ**: `snowfall`

---

## 4. 制約事項

- 新規API追加は行わない（Open-Meteoパラメータ追加のみ）
- 3Dアニメーション（Three.js等）は使用しない
- リアルタイム更新は行わない（15分キャッシュを維持）

---

**最終更新**: 2026-04-28
**バージョン**: 2.0
