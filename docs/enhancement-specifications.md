# City Observatory - 拡張機能仕様書

## 1. 概要

### 1.1 目的

既存のOpen-Meteo APIを活用し、**APIパラメータの追加のみ**で実装可能な視覚的インパクトの高い機能を追加する。

### 1.2 方針

- ✅ **既存APIの拡張のみ**（新規APIキー不要、新規エンドポイント不要）
- ✅ **無料枠内で実装**（リクエスト数増加なし）
- ✅ **「パッと見すごい」を重視**（ポートフォリオ向け）
- ✅ **実装コスト低**（URLパラメータ追加 + UI実装）

### 1.3 APIの確実性

**Open-Meteo公式ドキュメントで確認済み**（推測ではなく確実な仕様）

- ドキュメントURL: https://open-meteo.com/en/docs
- WMO Weather Code標準に準拠
- 全パラメータが無料プランで利用可能

---

## 2. 追加APIパラメータ一覧

### 2.1 Hourly Parameters（時間ごと）

**現在取得中:**

```
temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,apparent_temperature
```

**追加候補:**

| パラメータ名         | 説明              | 単位        | 用途                           |
| -------------------- | ----------------- | ----------- | ------------------------------ |
| `weathercode`        | WMO天気コード     | 0-99        | 天気アイコン・パーティクル表示 |
| `wind_direction_10m` | 風向き（地上10m） | 度（0-360） | 風向き矢印・アニメーション     |
| `cloud_cover`        | 総雲量            | %           | 雲アニメーション・背景色       |
| `uv_index`           | UV指数            | 0-11+       | UV警告表示                     |
| `visibility`         | 視程              | メートル    | 霧・視界の可視化               |
| `precipitation`      | 降水量            | mm          | 降水量の実測値表示             |
| `snowfall`           | 降雪量            | cm          | 雪アニメーション               |
| `pressure_msl`       | 海面気圧          | hPa         | 気圧変化グラフ                 |

### 2.2 Daily Parameters（日ごと）

**現在取得中:**

```
temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max
```

**追加候補:**

| パラメータ名         | 説明         | 単位    | 用途                   |
| -------------------- | ------------ | ------- | ---------------------- |
| `sunrise`            | 日の出時刻   | ISO8601 | 日の出/入り可視化      |
| `sunset`             | 日の入り時刻 | ISO8601 | 太陽軌道アニメーション |
| `uv_index_max`       | 最大UV指数   | 0-11+   | UV警告（日単位）       |
| `sunshine_duration`  | 日照時間     | 秒      | 晴天度の可視化         |
| `wind_speed_10m_max` | 最大風速     | m/s     | 強風警告               |
| `wind_gusts_10m_max` | 最大瞬間風速 | m/s     | 台風・暴風表示         |

### 2.3 Weather Code（天気コード）詳細

**WMO標準コード:**

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

**参考:** https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM

---

## 3. 実装する機能

### 3.1 優先度：高（実装必須）

#### E1. 風向き・風速ビジュアライザー

**概要:**

- 風向き矢印をアニメーション表示
- 風速に応じて矢印の長さ・色・動きの速度を変化

**追加APIパラメータ:**

- `wind_direction_10m` (hourly)

**実装方法:**

- SVG/CSS Animationで矢印を描画
- 現在値カードに風向きコンパスを追加
- 地図上に風向きレイヤー（任意）

**UI設計:**

```
┌─────────────────┐
│  風向き・風速   │
│                 │
│      ↗         │  ← 矢印が風向きを示す
│   北東の風      │
│   3.5 m/s      │
└─────────────────┘
```

#### E2. 天気コードによる背景・アイコン変化

**概要:**

- 天気コードに応じて背景色・グラデーションを動的変更
- 天気アイコンを正確に表示（現在は気温のみ）

**追加APIパラメータ:**

- `weathercode` (hourly)

**実装方法:**

- `getWeatherIcon(code: number)` 関数を実装
- 背景グラデーションをweathercodeベースで生成
- Lucide Reactのアイコンを活用

**天気別の背景色例:**

```typescript
const weatherBackgrounds = {
  0: "linear-gradient(to bottom, #87CEEB, #E0F6FF)", // 快晴
  1: "linear-gradient(to bottom, #B0C4DE, #E8F4F8)", // 晴れ
  3: "linear-gradient(to bottom, #778899, #D3D3D3)", // 曇り
  61: "linear-gradient(to bottom, #4682B4, #B0C4DE)", // 雨
  71: "linear-gradient(to bottom, #E0FFFF, #FFFFFF)", // 雪
  95: "linear-gradient(to bottom, #2F4F4F, #696969)", // 雷雨
};
```

#### E3. 日の出/日の入り可視化

**概要:**

- 太陽の軌道を円弧で表示
- 現在時刻を動く太陽アイコンで表現
- 日の出前/日中/日の入り後で背景色を変化

**追加APIパラメータ:**

- `sunrise` (daily)
- `sunset` (daily)

**実装方法:**

- SVGで太陽の軌道を描画
- 現在時刻から太陽の位置を計算
- CSS変数で昼/夕/夜のテーマを切り替え

**UI設計:**

```
    🌅 6:45          現在 14:30          🌇 17:20
     ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾☀️‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲
    ╱                                      ╲
```

#### E4. UV指数カード

**概要:**

- UV指数を色分け表示
- 警告レベル（低/中/高/非常に高い）を表示

**追加APIパラメータ:**

- `uv_index` (hourly)
- `uv_index_max` (daily)

**実装方法:**

- 既存のAQカードと同様のデザイン
- UV指数レベルの分類関数を実装

**UV指数の分類:**
| UV指数 | レベル | 色 |
|--------|--------|-----|
| 0-2 | 低い | 緑 |
| 3-5 | 中程度 | 黄 |
| 6-7 | 高い | オレンジ |
| 8-10 | 非常に高い | 赤 |
| 11+ | 極端に高い | 紫 |

### 3.2 優先度：中（余裕があれば実装）

#### E5. 降水量の実測値表示

**概要:**

- 現在の降水確率だけでなく、実際の降水量も表示
- 24時間累積降水量をグラフ化

**追加APIパラメータ:**

- `precipitation` (hourly)

**実装方法:**

- 既存の降水確率カードに降水量を追加
- グラフに降水量の棒グラフを重ねて表示

#### E6. 雲量アニメーション

**概要:**

- 雲量に応じて雲のイラストを動的表示
- 雲の移動アニメーション

**追加APIパラメータ:**

- `cloud_cover` (hourly)

**実装方法:**

- SVGで雲を描画
- CSS Animationで流れるように移動
- 雲量%に応じて雲の数を調整

#### E7. 気圧変化グラフ

**概要:**

- 海面気圧の24時間推移を表示
- 気圧の上昇/下降傾向を矢印で表示

**追加APIパラメータ:**

- `pressure_msl` (hourly)

**実装方法:**

- Rechartsで折れ線グラフを追加
- 気圧変化から天気予測コメントを表示

### 3.3 優先度：低（将来拡張）

#### E8. 視程（霧）の可視化

**追加APIパラメータ:** `visibility`

#### E9. 降雪アニメーション

**追加APIパラメータ:** `snowfall`

---

## 4. データモデル拡張

### 4.1 WeatherHourly（拡張版）

```typescript
// lib/types/weather.ts
type WeatherHourly = {
  time: string[];

  // 既存
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  apparent_temperature: number[];

  // 新規追加
  weathercode: number[];
  wind_direction_10m: number[];
  cloud_cover: number[];
  uv_index: number[];
  visibility?: number[]; // 任意
  precipitation: number[];
  pressure_msl?: number[]; // 任意
};
```

### 4.2 WeatherDaily（拡張版）

```typescript
type WeatherDaily = {
  time: string[];

  // 既存
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];

  // 新規追加
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  sunshine_duration?: number[]; // 任意
};
```

---

## 5. UI/UX設計

### 5.1 レイアウト変更

**既存のダッシュボードに追加:**

```
┌────────────────────────────────────────┐
│  都市ヘッダー + 日の出/日の入り表示      │
├─────────────┬──────────────────────────┤
│             │                          │
│  天気カード │     地図（既存）          │
│  + UV指数   │                          │
│  + 風向き   │                          │
│             │                          │
├─────────────┴──────────────────────────┤
│  24時間グラフ（気温・降水量・気圧）      │
├────────────────────────────────────────┤
│  PM2.5グラフ（既存）                    │
└────────────────────────────────────────┘
```

### 5.2 カラーパレット

**天気別テーマカラー:**

- 快晴: `#87CEEB` → `#E0F6FF`
- 曇り: `#778899` → `#D3D3D3`
- 雨: `#4682B4` → `#B0C4DE`
- 雪: `#E0FFFF` → `#FFFFFF`
- 雷雨: `#2F4F4F` → `#696969`

**UV指数カラー:**

- 低: `hsl(120, 60%, 50%)` 緑
- 中: `hsl(60, 100%, 50%)` 黄
- 高: `hsl(30, 100%, 50%)` オレンジ
- 非常に高い: `hsl(0, 100%, 50%)` 赤
- 極端: `hsl(270, 100%, 40%)` 紫

---

## 6. 実装順序

### Phase 1: APIパラメータ追加（1-2時間）

1. `lib/api/weather.ts` の `getWeatherForecast()` を修正
2. `lib/validators/weather.ts` のZodスキーマを拡張
3. `lib/types/weather.ts` の型定義を更新

### Phase 2: ドメインロジック実装（2-3時間）

1. `lib/domain/weather-classification.ts` を作成
   - `getWeatherIcon(code: number)`
   - `getWeatherLabel(code: number)`
   - `getWeatherBackground(code: number)`
2. `lib/domain/uv-classification.ts` を作成
   - `classifyUV(index: number)`
3. `lib/domain/wind-direction.ts` を作成
   - `getWindDirectionLabel(degree: number)` （「北東」など）
   - `getWindDirectionRotation(degree: number)`

### Phase 3: UI実装（3-5時間）

1. **E2 天気コード対応**
   - `features/weather/ui/weather-icon.tsx` を作成
   - 背景グラデーション適用
2. **E4 UV指数カード**
   - `features/weather/ui/uv-card.tsx` を作成
3. **E1 風向きカード**
   - `features/weather/ui/wind-card.tsx` を作成
4. **E3 日の出/入り表示**
   - `features/weather/ui/sun-path.tsx` を作成

### Phase 4: 統合・テスト（1-2時間）

1. ダッシュボードに新カードを配置
2. レスポンシブ対応確認
3. データ取得エラー時の挙動確認

**合計見積もり: 7-12時間**

---

## 7. 非機能要件

### 7.1 パフォーマンス

- APIリクエスト数: **変更なし**（パラメータ追加のみ）
- レスポンスサイズ: 約1.5倍（許容範囲内）
- キャッシュ戦略: 既存と同じ（15分stale）

### 7.2 互換性

- 既存機能への影響: **なし**
- ブラウザ対応: 既存と同じ（モダンブラウザ）
- アクセシビリティ: 新規カードにaria-label追加

### 7.3 エラーハンドリング

- 新規パラメータが取得できない場合: 該当カードを非表示
- weathercodeが不明な値: デフォルトアイコン表示
- sunrise/sunsetがnull: 「データなし」表示

---

## 8. 制約事項

### 8.1 実装しないもの

- ❌ 新規API追加（Historical Weather APIなど）
- ❌ 3Dアニメーション（Three.jsなど重量級ライブラリ）
- ❌ リアルタイム更新（15分キャッシュを維持）

### 8.2 将来拡張の余地

- 天気パーティクルアニメーション（Canvas/WebGL）
- 地図上への風向き矢印レイヤー
- 時間スライダー（24時間を動的再生）

---

## 9. 参考資料

### 9.1 公式ドキュメント

- Open-Meteo Weather API: https://open-meteo.com/en/docs
- WMO Weather Code: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM

### 9.2 デザイン参考

- Lucide Icons: https://lucide.dev/icons/
- UV Index Guidelines: https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index

---

**最終更新**: 2026-01-31
**作成者**: haru
**バージョン**: 1.0
**ステータス**: 仕様確定（実装待ち）
