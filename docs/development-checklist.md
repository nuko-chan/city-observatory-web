# City Observatory - 開発手順書（チェックリスト）

このドキュメントは、City Observatory アプリの開発を段階的に進めるための詳細なチェックリストです。AI 駆動開発を想定し、各タスクを明確に定義しています。

---

## フェーズ 0: 事前準備（セットアップ前）

### 0-1. 仕様の固定

- [ ] アプリ名とコンセプトを 1 行で決定（City Observatory - 都市の"いま"を観測するダッシュボード）
- [ ] 必須機能を 5 つに固定（検索/地図/天気/AQ/比較）
- [ ] 技術スタックを明記（Next.js 16 + TypeScript + shadcn/ui + MapLibre + Recharts）
- [ ] データソースを確定（Open-Meteo + MapTiler）
- [ ] 非商用・ポートフォリオ用途であることを README に記載

### 0-2. アカウント・API キー取得

- [ ] MapTiler アカウント作成（https://www.maptiler.com/）
- [ ] MapTiler **DEV キー** を発行（開発用）
- [ ] MapTiler **PROD キー** を発行（本番用）
- [ ] DEV キーに **Allowed HTTP origins** を設定
  - `http://localhost:3000`
  - `https://*.vercel.app` （Preview デプロイ用）
- [ ] PROD キーに **Allowed HTTP origins** を設定（後で本番 URL を追加）
- [ ] MapTiler の Free プラン上限を確認（100,000 タイル/月）
- [ ] （任意）Sentry アカウント作成（エラー監視用）

### 0-3. デプロイ先準備

- [ ] 本番 URL を決定（例: `city-observatory.vercel.app` or 独自ドメイン）
- [ ] ドメイン使用の場合、DNS 設定準備
- [ ] Vercel アカウント確認（GitHub と連携済みか）

---

## フェーズ 1: プロジェクト初期化

### 1-1. リポジトリ作成

- [ ] GitHub で新規リポジトリ作成（`city-observatory`）
- [ ] リポジトリの可視性を設定（Public 推奨、ポートフォリオ用）
- [ ] リポジトリの説明を追加（"都市の天気・大気質を可視化するダッシュボード"）
- [ ] トピックタグを追加（`nextjs`, `typescript`, `weather`, `dashboard`, `portfolio`）

### 1-2. Next.js 初期化

```bash
pnpm create next-app city-observatory --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd city-observatory
```

- [ ] Next.js（App Router）をインストール
- [ ] TypeScript 設定を確認（`strict: true`）
- [ ] Tailwind CSS 導入を確認
- [ ] インポートエイリアス `@/*` が機能するか確認

### 1-3. 依存パッケージ追加

```bash
pnpm add @tanstack/react-query jotai zod maplibre-gl recharts lucide-react nuqs
pnpm add -D @types/maplibre-gl vitest @playwright/test
```

- [ ] TanStack Query インストール
- [ ] **Jotai インストール**（グローバル状態管理、coding-guidelines 準拠）
- [ ] Zod インストール
- [ ] MapLibre GL JS インストール
- [ ] Recharts インストール
- [ ] lucide-react インストール
- [ ] nuqs（URL 同期）インストール
- [ ] 開発依存パッケージ インストール（Vitest, Playwright）

**重要**: `useContext`の使用は禁止（coding-guidelines 準拠）。グローバル状態には jotai を使用すること。

### 1-4. shadcn/ui セットアップ

```bash
pnpm dlx shadcn@latest init
```

- [ ] shadcn/ui 初期化（スタイル: new-york, カラー: neutral）
- [ ] `components.json` の設定確認
- [ ] 必要なコンポーネントを追加
  ```bash
  pnpm dlx shadcn@latest add button card input tabs select skeleton
  ```
- [ ] `lib/utils.ts` が作成されたことを確認

### 1-5. ESLint / Prettier 設定

- [ ] ESLint 設定ファイル確認（`eslint.config.mjs`）
- [ ] Prettier 設定ファイル作成（`.prettierrc`）
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 2
  }
  ```
- [ ] `.prettierignore` 作成
  ```
  .next
  node_modules
  pnpm-lock.yaml
  ```

### 1-6. Git 初期化・初回コミット

```bash
git init
git add .
git commit -m "Initial commit: Next.js 16 with TypeScript and Tailwind"
git branch -M main
git remote add origin git@github.com:yourusername/city-observatory.git
git push -u origin main
```

- [ ] Git リポジトリ初期化
- [ ] `.gitignore` に `.env.local` が含まれていることを確認
- [ ] 初回コミット
- [ ] GitHub にプッシュ

---

## フェーズ 2: 環境変数・設定ファイル

### 2-1. 環境変数ファイル作成

- [ ] `.env.example` 作成

  ```bash
  # MapTiler API Key
  NEXT_PUBLIC_MAPTILER_KEY=

  # Map Styles
  NEXT_PUBLIC_MAP_STYLE_LIGHT=https://api.maptiler.com/maps/streets-v2/style.json
  NEXT_PUBLIC_MAP_STYLE_DARK=https://api.maptiler.com/maps/streets-v2-dark/style.json

  # Defaults
  NEXT_PUBLIC_DEFAULT_CITY=tokyo

  # Feature Flags
  NEXT_PUBLIC_FEATURE_MAP=true

  # Monitoring (optional)
  NEXT_PUBLIC_SENTRY_DSN=
  ```

- [ ] `.env.local` 作成（実際の API キーを設定）

  ```bash
  NEXT_PUBLIC_MAPTILER_KEY=your_dev_key_here
  NEXT_PUBLIC_MAP_STYLE_LIGHT=https://api.maptiler.com/maps/streets-v2/style.json
  NEXT_PUBLIC_MAP_STYLE_DARK=https://api.maptiler.com/maps/streets-v2-dark/style.json
  NEXT_PUBLIC_DEFAULT_CITY=tokyo
  NEXT_PUBLIC_FEATURE_MAP=true
  ```

- [ ] `.gitignore` に `.env.local` が含まれていることを再確認

### 2-2. 環境変数の型定義

- [ ] `lib/env.ts` を作成

  ```typescript
  import { z } from "zod";

  const envSchema = z.object({
    NEXT_PUBLIC_MAPTILER_KEY: z.string().min(1),
    NEXT_PUBLIC_MAP_STYLE_LIGHT: z.string().url().optional(),
    NEXT_PUBLIC_MAP_STYLE_DARK: z.string().url().optional(),
    NEXT_PUBLIC_DEFAULT_CITY: z.string().default("tokyo"),
    NEXT_PUBLIC_FEATURE_MAP: z
      .string()
      .transform((val) => val === "true")
      .default("true"),
  });

  export const env = envSchema.parse({
    NEXT_PUBLIC_MAPTILER_KEY: process.env.NEXT_PUBLIC_MAPTILER_KEY,
    NEXT_PUBLIC_MAP_STYLE_LIGHT: process.env.NEXT_PUBLIC_MAP_STYLE_LIGHT,
    NEXT_PUBLIC_MAP_STYLE_DARK: process.env.NEXT_PUBLIC_MAP_STYLE_DARK,
    NEXT_PUBLIC_DEFAULT_CITY: process.env.NEXT_PUBLIC_DEFAULT_CITY,
    NEXT_PUBLIC_FEATURE_MAP: process.env.NEXT_PUBLIC_FEATURE_MAP,
  });
  ```

### 2-3. Vercel 環境変数設定

- [ ] Vercel プロジェクト作成（GitHub リポジトリと連携）
- [ ] **Preview 環境** の環境変数を設定
  - `NEXT_PUBLIC_MAPTILER_KEY`: DEV キー
  - その他の環境変数も同様に設定
- [ ] **Production 環境** の環境変数を設定
  - `NEXT_PUBLIC_MAPTILER_KEY`: PROD キー
  - その他の環境変数も同様に設定
- [ ] Vercel で `vercel env pull` を実行してローカルに同期（任意）

---

## フェーズ 3: データ層実装

**重要**: 全ての型定義は`interface`ではなく`type`を使用すること（coding-guidelines 準拠）

### 3-1. 型定義（FSD 構造に従う）

- [ ] `lib/types/location.ts` 作成

  ```typescript
  // coding-guidelines: typeを使用（interfaceは禁止）
  export type Location = {
    id: number;
    name: string;
    country: string;
    lat: number;
    lon: number;
    timezone: string;
    elevation?: number; // undefinedを優先（nullではなく）
  };
  ```

- [ ] `lib/types/weather.ts` 作成
- [ ] `lib/types/air-quality.ts` 作成
- [ ] 派生指標の型定義も`type`で作成

### 3-2. Zod バリデーター作成（FSD 構造、kebab-case）

- [ ] `lib/validators/location.ts` 作成
- [ ] `lib/validators/weather.ts` 作成
- [ ] `lib/validators/air-quality.ts` 作成

### 3-3. API クライアント実装（FSD 構造、kebab-case、トップレベル関数は function 宣言）

**重要**:

- トップレベル関数は`function`宣言を使用（async function も同様）
- ファイル名・ディレクトリ名は全て kebab-case

#### 3-3-1. Geocoding API（都市検索）

- [ ] `lib/api/geocoding.ts` 作成
- [ ] `searchCities(query: string)` 関数実装（`function`宣言）
  - エンドポイント: `https://geocoding-api.open-meteo.com/v1/search`
  - パラメータ: `name=${query}&count=10&language=ja&format=json`
- [ ] Zod でレスポンスをバリデーション
- [ ] エラーハンドリング実装（try-catch, APIError）

#### 3-3-2. Weather Forecast API（天気予報）

- [ ] `lib/api/weather.ts` 作成
- [ ] `getWeatherForecast(lat: number, lon: number, range: '24h' | '7d')` 関数実装（`function`宣言）
  - エンドポイント: `https://api.open-meteo.com/v1/forecast`
  - パラメータ:
    - `latitude=${lat}&longitude=${lon}`
    - `hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,apparent_temperature`
    - `daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max`
    - `timezone=auto`
- [ ] Zod でレスポンスをバリデーション
- [ ] range に応じて forecast_days を調整（24h=1, 7d=7）

#### 3-3-3. Air Quality API（大気質予報）

- [ ] `lib/api/air-quality.ts` 作成
- [ ] `getAirQualityForecast(lat: number, lon: number, range: '24h' | '5d')` 関数実装
  - エンドポイント: `https://air-quality-api.open-meteo.com/v1/air-quality`
  - パラメータ:
    - `latitude=${lat}&longitude=${lon}`
    - `hourly=pm10,pm2_5,nitrogen_dioxide,ozone`
    - `timezone=auto`
- [ ] Zod でレスポンスをバリデーション

### 3-4. エラーハンドリング

- [ ] `lib/api/errors.ts` 作成
  ```typescript
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
  ```

---

## フェーズ 4: ドメインロジック（派生指標）

### 4-1. 快適度スコア算出

- [ ] `lib/domain/comfort-score.ts` 作成
- [ ] `calculateComfortScore()` 実装
  - 入力: 気温、湿度、風速、降水量、PM2.5
  - 出力: 0-100 のスコア
  - ロジック: 各要素を重み付けして合算（説明可能な式）
- [ ] ユニットテスト作成（`tests/unit/domain/comfort-score.test.ts`）

### 4-2. 外出リスクレベル算出

- [ ] `lib/domain/outdoor-risk.ts` 作成
- [ ] `calculateOutdoorRisk()` 実装
  - 入力: 降水確率、風速、PM2.5
  - 出力: 'low' | 'medium' | 'high'
- [ ] ユニットテスト作成

### 4-3. ベストタイムスロット算出

- [ ] `lib/domain/best-time-slots.ts` 作成
- [ ] `findBestTimeSlots()` 実装
  - 入力: 24 時間の快適度スコア配列
  - 出力: スコア上位 3 つの時間帯
- [ ] ユニットテスト作成

### 4-4. AQI 分類

- [ ] `lib/domain/aqi-classification.ts` 作成
- [ ] `classifyAQI(pm25: number)` 実装
  - PM2.5 濃度に基づく分類: 'good' | 'moderate' | 'unhealthy' | 'hazardous'
- [ ] ユニットテスト作成

---

## フェーズ 5: カスタムフック

### 5-1. TanStack Query Provider 設定

- [ ] `app/providers.tsx` 作成

  ```typescript
  "use client";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
  import { useState } from "react";

  export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 5 * 60 * 1000,
              cacheTime: 10 * 60 * 1000,
              retry: 2,
              refetchOnWindowFocus: false,
            },
          },
        })
    );

    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  }
  ```

- [ ] `app/layout.tsx` で `<Providers>` をラップ

### 5-2. カスタムフック実装

#### 5-2-1. useCitySearch

- [ ] `features/city-search/model/use-city-search.ts` 作成
- [ ] デバウンス実装（`useDebounce` フックも作成）
- [ ] TanStack Query で都市検索 API を呼び出し
- [ ] 2 文字以上で検索開始（`enabled` 条件）

#### 5-2-2. useWeatherData

- [ ] `features/weather/model/use-weather-data.ts` 作成
- [ ] TanStack Query で天気 API を呼び出し
- [ ] キャッシュ戦略: 15 分 stale
- [ ] 429 エラー時はリトライしない

#### 5-2-3. useAirQualityData

- [ ] `features/air-quality/model/use-air-quality-data.ts` 作成
- [ ] TanStack Query で大気質 API を呼び出し
- [ ] キャッシュ戦略: 15 分 stale

#### 5-2-4. useDerivedMetrics

- [ ] `features/derived-metrics/model/use-derived-metrics.ts` 作成（必要なら）
- [ ] 天気データと AQ データから派生指標を算出
- [ ] `useMemo` でメモ化

---

## フェーズ 6: UI コンポーネント実装（地図以外）

### 6-1. レイアウトコンポーネント

- [ ] `components/layout/header.tsx` 作成
  - アプリ名、ロゴ、ナビゲーション
- [ ] `components/layout/footer.tsx` 作成
  - クレジット表記（Open-Meteo）、GitHub リンク
- [ ] `components/layout/error-boundary.tsx` 作成（Class Component）

### 6-2. 都市検索コンポーネント

- [ ] `features/city-search/ui/city-search-input.tsx` 作成
  - テキスト入力
  - `useCitySearch` フック使用
  - デバウンス付きサジェスト
- [ ] `features/city-search/ui/city-suggestions.tsx` 作成
  - サジェスト一覧表示
  - キーボード操作対応（↑↓Enter Escape）
  - `data-testid` 付与

### 6-3. 天気コンポーネント

- [ ] `features/weather/ui/weather-card.tsx` 作成
  - 現在の気温、体感温度、湿度、風速、降水確率
  - アイコン表示（lucide-react）
  - ローディング・エラー状態
- [ ] `features/weather/ui/weather-chart.tsx` 作成
  - Recharts（AreaChart）使用
  - 24h/7d 切替対応
  - ツールチップ、グラデーション
  - dynamic import（SSR 無効化）
- [ ] `features/weather/ui/weather-table.tsx` 作成
  - 時間帯ごとの詳細データをテーブル表示
  - 仮想スクロール（任意、データ量次第）

### 6-4. 大気質コンポーネント

- [ ] `features/air-quality/ui/aq-card.tsx` 作成
  - PM2.5、PM10、NO2、O3 表示
  - AQI 分類によるカラーコード
- [ ] `features/air-quality/ui/aq-chart.tsx` 作成
  - Recharts 使用
  - PM2.5 の時系列チャート（24h/5d）

### 6-5. 比較コンポーネント

- [ ] `features/compare/ui/compare-view.tsx` 作成
  - 2 都市選択 UI（Select）
  - KPI カードの横並び比較
  - 比較チャート（重ねて表示）
  - 差分のハイライト表示

### 6-6. 共通 UI コンポーネント

- [ ] `components/ui/skeleton.tsx` 確認・調整（ローディング用）
- [ ] スケルトンコンポーネントを各フィーチャーに適用

---

## フェーズ 7: 地図実装

### 7-1. 地図コンポーネント

- [ ] `features/map/ui/map-view-client.tsx` 作成（Client Component）
  - MapLibre GL JS 初期化
  - 環境変数からスタイル URL 取得（`env.NEXT_PUBLIC_MAP_STYLE_LIGHT`）
  - マーカー表示
  - ズーム・パン対応
  - クレジット表記（attributionControl: true）
- [ ] `features/map/ui/map-view.tsx` 作成（dynamic import wrapper）
  ```typescript
  import dynamic from "next/dynamic";
  export const MapView = dynamic(() => import("./map-view-client"), {
    ssr: false,
    loading: () => <MapSkeleton />,
  });
  ```

### 7-2. 地図コントロール

- [ ] `features/map/ui/map-controls.tsx` 作成
  - スタイル切替ボタン（ライト/ダーク）
  - レイヤー切替ボタン（天気/AQ/降水）
  - ズームイン/アウトボタン

### 7-3. MapTiler ロゴ表示（Free プラン）

- [ ] map-view-client 内にロゴ画像を追加
  ```tsx
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
  ```

### 7-4. レイヤー実装（任意）

- [ ] AQ ヒートマップレイヤー追加（MapLibre のカスタムレイヤー）
- [ ] 降水量レイヤー追加（タイル重ね合わせ、任意）

---

## フェーズ 8: ページ実装

### 8-1. Landing ページ

- [ ] `app/page.tsx` 実装
  - ヘッダー（アプリ名・説明）
  - 都市検索ボックス（CitySearchInput）
  - おすすめ都市カード（Tokyo, Osaka, Sapporo 等）
  - カードクリックで Dashboard へ遷移

### 8-2. City Dashboard ページ

- [ ] `app/dashboard/page.tsx` 実装
  - URL クエリパラメータから都市 ID を取得（nuqs 使用）
  - 2 カラムレイアウト（PC）、1 カラム（SP）
  - 左カラム:
    - 都市情報ヘッダー
    - KPI カード（WeatherCard, AQCard）
    - タブ切替（天気/大気質/詳細）
    - チャート（WeatherChart, AQChart）
    - 詳細テーブル
  - 右カラム:
    - MapView
    - MapControls
- [ ] `app/dashboard/loading.tsx` 実装（スケルトン）
- [ ] `app/dashboard/error.tsx` 実装（エラー表示）

### 8-3. 比較ページ

- [ ] `app/compare/page.tsx` 実装
  - URL クエリパラメータから都市 ID（2 つ）を取得
  - CompareView 表示
  - URL 共有ボタン（クリップボードコピー）

### 8-4. URL 同期

- [ ] nuqs で状態を URL に同期
  - 天気例: `?city=tokyo&tab=weather&range=7d`
  - AQ例: `?city=tokyo&tab=aq&range=5d`
- [ ] ブラウザバック/フォワード対応確認

---

## フェーズ 9: スタイリング・レスポンシブ

### 9-1. グローバルスタイル

- [ ] `app/globals.css` のテーマ設定確認
  - ダークモード対応（CSS 変数）
  - カラーパレット（OKLCH）
  - ボーダーラディウス

### 9-2. レスポンシブデザイン

- [ ] SP 表示確認（〜md）
  - 1 カラムレイアウト
  - 地図の折りたたみ or 縮小表示
  - タッチ操作対応
- [ ] PC 表示確認（md〜）
  - 2 カラムレイアウト
  - 適切な余白・サイズ

### 9-3. ダークモード

- [ ] ダークモード切替ボタン実装（Header 内）
- [ ] `next-themes` パッケージ導入（任意）
- [ ] 全コンポーネントでダークモード表示確認

---

## フェーズ 10: アクセシビリティ・UX

### 10-1. キーボード操作

- [ ] 都市検索のキーボード操作確認（↑↓Enter Escape）
- [ ] タブキーでのフォーカス遷移確認
- [ ] フォーカスインジケーター表示確認

### 10-2. ARIA 属性

- [ ] `aria-label` 追加（アイコンボタン等）
- [ ] `aria-describedby` 追加（フォーム入力）
- [ ] `role` 属性追加（ランドマーク）

### 10-3. カラーコントラスト

- [ ] WCAG AA 準拠（4.5:1 以上）確認
- [ ] ブラウザ DevTools でコントラストチェック

### 10-4. スクリーンリーダー

- [ ] macOS VoiceOver で主要操作を確認（任意）
- [ ] 代替テキスト（alt）の追加確認

### 10-5. スムーズなトランジション

- [ ] タブ切替時のトランジション追加（Tailwind の`transition-*`）
- [ ] カード展開アニメーション追加（任意）

---

## フェーズ 11: パフォーマンス最適化

### 11-1. バンドルサイズ確認

```bash
pnpm build
pnpm run analyze # (必要に応じて@next/bundle-analyzerを導入)
```

- [ ] ビルドサイズ確認（< 300KB gzip 目標）
- [ ] 不要な依存パッケージ削除
- [ ] Tree-shaking 確認

### 11-2. 画像最適化

- [ ] `next/image` 使用確認
- [ ] 遅延ロード（`loading="lazy"`）
- [ ] プレースホルダー（`placeholder="blur"`）

### 11-3. コード分割

- [ ] 地図コンポーネントの dynamic import 確認
- [ ] チャートコンポーネントの dynamic import 確認
- [ ] ページ遷移時のプリフェッチ確認

### 11-4. Lighthouse 測定

```bash
pnpm build && pnpm start
# ブラウザでLighthouse実行
```

- [ ] Performance スコア 90+
- [ ] Accessibility スコア 90+
- [ ] Best Practices スコア 90+
- [ ] SEO スコア 90+
- [ ] Core Web Vitals 確認（FCP, LCP, CLS, TTI）

### 11-5. メモ化

- [ ] 重い計算を`useMemo`でメモ化
- [ ] コールバック関数を`useCallback`でメモ化
- [ ] 不要な再レンダリング削減（React DevTools Profiler で確認）

---

## フェーズ 12: テスト（必要最小限）

### 12-1. ユニットテスト

- [ ] Vitest 設定ファイル作成（`vitest.config.ts`）
- [ ] ドメインロジックのテスト実装（派生指標のみ）
  - `tests/unit/domain/comfort-score.test.ts`
  - `tests/unit/domain/outdoor-risk.test.ts`
  - `tests/unit/domain/best-time-slots.test.ts`
  - `tests/unit/domain/aqi-classification.test.ts`
- [ ] テストカバレッジ確認（必要に応じて）
  ```bash
  pnpm vitest --coverage
  ```

### 12-2. E2E テスト

- [ ] Playwright 設定ファイル作成（`playwright.config.ts`）
- [ ] 主要シナリオの E2E テスト実装（最低 1 本）
  - `tests/e2e/dashboard.spec.ts`: 都市検索 → ダッシュボード表示
  - `tests/e2e/compare.spec.ts`: 都市比較モード（余裕があれば）
- [ ] E2E テスト実行
  ```bash
  pnpm playwright test
  ```

### 12-3. 手動テスト

- [ ] 主要ブラウザでの動作確認（Chrome, Firefox, Safari, Edge）
- [ ] モバイルブラウザでの動作確認（iOS Safari, Android Chrome）
- [ ] エラーケースの確認
  - API 障害時（ネットワークオフライン）
  - 429 エラー時
  - 存在しない都市の検索

---

## フェーズ 13: デプロイ準備

### 13-1. README 作成

- [ ] プロジェクト概要（1-2 段落）
- [ ] スクリーンショット（3 枚 + 15 秒 GIF）
- [ ] 主要機能リスト
- [ ] 技術スタック（表形式）
- [ ] 技術的に頑張った点（3 つ）
  1. 状態管理（キャッシュ・エラー・URL 同期）
  2. データ品質（Zod・派生指標・テスト）
  3. UX（レスポンシブ・操作性・パフォーマンス）
- [ ] セットアップ手順
  ```bash
  git clone https://github.com/yourusername/city-observatory.git
  cd city-observatory
  cp .env.example .env.local
  # .env.localに実際のAPIキーを設定
  pnpm install
  pnpm dev
  ```
- [ ] ライセンス（MIT 推奨）
- [ ] クレジット表記（Open-Meteo, MapTiler, OSM）

### 13-2. 本番環境変数の最終確認

- [ ] Vercel Production 環境の環境変数確認
- [ ] PROD キーの Allowed HTTP origins に本番 URL を追加
- [ ] 不要な環境変数の削除

### 13-3. セキュリティチェック

- [ ] `.env.local` が Git にコミットされていないか確認
  ```bash
  git log --all --full-history -- .env.local
  ```
- [ ] 依存パッケージの脆弱性チェック
  ```bash
  pnpm audit
  ```
- [ ] ハードコードされたシークレットがないか確認

---

## フェーズ 14: デプロイ

### 14-1. Preview デプロイ

```bash
git checkout -b feature/final-touches
git add .
git commit -m "Final touches before production"
git push origin feature/final-touches
```

- [ ] GitHub にプッシュ
- [ ] Vercel Preview デプロイ自動生成を確認
- [ ] Preview URL で全機能動作確認
  - 都市検索
  - ダッシュボード表示
  - 地図表示（タイル読み込み）
  - チャート表示
  - 比較モード
  - レスポンシブ表示

### 14-2. Production デプロイ

```bash
git checkout main
git merge feature/final-touches
git push origin main
```

- [ ] main ブランチにマージ
- [ ] Vercel Production デプロイ自動実行を確認
- [ ] 本番 URL で全機能動作確認

### 14-3. デプロイ後確認

- [ ] 本番 URL アクセス確認
- [ ] クレジット表記確認（OSM, MapTiler, Open-Meteo）
- [ ] MapTiler ロゴ表示確認（Free プラン）
- [ ] Lighthouse で再測定（本番環境）
- [ ] エラー監視ツール確認（Sentry 等、導入した場合）

---

## フェーズ 15: ポートフォリオとしての仕上げ

### 15-1. スクリーンショット・GIF 作成

- [ ] ファーストビューのスクリーンショット
- [ ] ダッシュボード画面のスクリーンショット
- [ ] 比較モード画面のスクリーンショット
- [ ] 15 秒デモ GIF 作成（都市検索 → 地図 → チャート → 比較の流れ）
  - ツール例: Kap (macOS), ScreenToGif (Windows)

### 15-2. デモ台本作成

- [ ] 1 分間のデモ台本を用意
  1. Landing ページ（おすすめ都市紹介）
  2. 都市検索（Tokyo 入力 → サジェスト → 選択）
  3. ダッシュボード（KPI カード → チャート → 地図）
  4. 大気質タブ切替
  5. 比較モード（Tokyo vs Osaka）
  6. 技術的ポイント説明（URL 同期・エラーハンドリング等）

### 15-3. GitHub Repository 整備

- [ ] リポジトリの About セクション編集
  - Description: "都市の天気・大気質を可視化するダッシュボード（Next.js 16 + TypeScript + MapLibre）"
  - Website: 本番 URL
  - Topics: `nextjs`, `typescript`, `weather`, `dashboard`, `portfolio`, `maplibre`, `recharts`
- [ ] README.md に本番 URL とスクリーンショット追加
- [ ] LICENSE 追加（MIT 推奨）
- [ ] CONTRIBUTING.md（任意、オープンソース化する場合）

### 15-4. ポートフォリオサイトへの掲載

- [ ] 個人ポートフォリオサイトにプロジェクトを追加
- [ ] プロジェクト説明（背景・目的・成果）を記載
- [ ] 技術スタック・担当範囲を明記
- [ ] 本番 URL と GitHub リンク追加

### 15-5. レジュメ更新

- [ ] 職務経歴書にプロジェクトを追加
  - プロジェクト名: City Observatory
  - 期間: 実装期間
  - 役割: フルスタック（フロントエンド中心）
  - 技術: Next.js 16, TypeScript, React 19, Tailwind CSS v4, MapLibre GL JS, Recharts, TanStack Query, Zod
  - 成果: ポートフォリオとしての評価獲得、技術スキル証明

---

## フェーズ 16: 継続的改善（任意）

### 16-1. ユーザーフィードバック収集

- [ ] GitHub の Issues 有効化
- [ ] フィードバックフォーム追加（Google Forms 等）
- [ ] アクセス解析データ確認（Vercel Analytics 等）

### 16-2. 機能拡張

- [ ] ローカルストレージでお気に入り都市保存
- [ ] PWA 化（Service Worker、マニフェスト）
- [ ] 多言語対応（i18n）
- [ ] ソーシャルシェア機能
- [ ] アニメーション強化（Framer Motion）

### 16-3. パフォーマンス継続監視

- [ ] 定期的な Lighthouse 測定
- [ ] Core Web Vitals 監視
- [ ] バンドルサイズ監視

---

## チェックリスト完了確認

### 最終チェック

- [ ] 全ての主要機能が動作している
- [ ] エラーハンドリングが適切に実装されている
- [ ] レスポンシブデザインが機能している
- [ ] アクセシビリティ要件を満たしている
- [ ] パフォーマンスが良好（Lighthouse 90+）
- [ ] テストが通過している
- [ ] クレジット表記が正しく表示されている
- [ ] README・ドキュメントが完成している
- [ ] 本番環境で問題なく動作している
- [ ] ポートフォリオとして提示できる品質になっている

---

**想定開発期間**: 5.5-7.5 日（AI 駆動で実装した場合）

**最終更新**: 2026-01-31
**作成者**: haru
**バージョン**: 1.0
