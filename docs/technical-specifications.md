# City Observatory - 技術仕様書

## 1. 技術スタック

### 1.1 コアフレームワーク

| カテゴリ                 | 技術       | バージョン | 用途                               |
| ------------------------ | ---------- | ---------- | ---------------------------------- |
| **フレームワーク**       | Next.js    | 16.x       | React フレームワーク（App Router） |
| **言語**                 | TypeScript | 5.x        | 型安全な開発                       |
| **UI ライブラリ**        | React      | 19.x       | ユーザーインターフェース構築       |
| **パッケージマネージャ** | pnpm       | 最新       | 依存関係管理                       |

### 1.2 スタイリング

| 技術                           | バージョン | 用途                                              |
| ------------------------------ | ---------- | ------------------------------------------------- |
| Tailwind CSS                   | 4.x        | ユーティリティファースト CSS                      |
| shadcn/ui                      | 最新       | UI コンポーネントライブラリ（"new-york"スタイル） |
| class-variance-authority (cva) | 最新       | バリアント管理                                    |
| clsx + tailwind-merge          | 最新       | クラス名の条件付き結合                            |
| Geist Font                     | 最新       | フォント（Sans/Mono）                             |

### 1.3 データ取得・状態管理

| 技術                         | 用途                                   |
| ---------------------------- | -------------------------------------- |
| TanStack Query (React Query) | サーバー状態管理、キャッシュ、リトライ |
| Jotai                        | グローバル状態管理（最小限の使用）     |
| Zod                          | スキーマバリデーション、型推論         |
| Nuqs (next-use-query-state)  | URL 同期状態管理                       |

**状態管理の方針**:

- ローカル状態: `useState`
- グローバル状態: `jotai`（不可避な場合のみ）
- `useContext` は禁止（coding-guidelines 準拠）

### 1.4 地図・可視化

| 技術           | 用途                            |
| -------------- | ------------------------------- |
| MapLibre GL JS | インタラクティブ地図（WebGL）   |
| Recharts       | チャート描画（shadcn/ui Chart） |
| lucide-react   | アイコンライブラリ              |

### 1.5 開発・品質管理

| 技術                   | 用途                          |
| ---------------------- | ----------------------------- |
| ESLint                 | 静的解析（eslint.config.mjs） |
| Prettier               | コードフォーマット            |
| Vitest                 | ユニットテスト                |
| Playwright             | E2E テスト                    |
| TypeScript strict mode | 型安全性の最大化              |

### 1.6 デプロイ・インフラ

| 技術   | 用途                         |
| ------ | ---------------------------- |
| Vercel | ホスティング（無料プラン）   |
| GitHub | ソースコード管理、CI/CD 連携 |

---

## 2. アーキテクチャ

### 2.1 全体構成図

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router (React 19 + TypeScript)             │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Pages/Routes │  │  Components  │  │   Hooks      │ │
│  │  - Landing    │  │  - UI (shad) │  │  - useQuery  │ │
│  │  - Dashboard  │  │  - Map       │  │  - useSearch │ │
│  │  - Compare    │  │  - Chart     │  │  - useCity   │ │
│  └───────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│          │                 │                  │         │
│          └─────────────────┴──────────────────┘         │
│                             │                            │
│  ┌──────────────────────────┴───────────────────────┐   │
│  │          Data Layer (TanStack Query)             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────┐│   │
│  │  │ API Client   │  │ Validators   │  │ Domain  ││   │
│  │  │ (fetch)      │  │ (Zod)        │  │ Logic   ││   │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬────┘│   │
│  └─────────┼──────────────────┼───────────────┼─────┘   │
└────────────┼──────────────────┼───────────────┼─────────┘
             │                  │               │
             ▼                  ▼               ▼
┌────────────────────────────────────────────────────────┐
│              External APIs (Open-Meteo, MapTiler)      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Geocoding   │  │   Weather    │  │  Air Quality │ │
│  │     API      │  │   Forecast   │  │     API      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────────────────────────────────────────┐  │
│  │         MapTiler Vector Tiles (地図タイル)       │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 2.2 構成方針（feature ベース）

#### 2.2.1 app/（ルーティング）

- **責務**: ルーティング、レイアウト、ページコンポーネント
- **技術**: Next.js App Router、React Server Components
- **命名規則**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

#### 2.2.2 features/（機能単位）

- **責務**: 機能ごとの UI・ロジックを集約
- **例**: `city-search`, `weather`, `air-quality`, `map`, `compare`
- **内部構成**:
  - `ui/`: 機能固有の UI
  - `model/`: フック・状態・イベント
  - `lib/`: 機能専用の補助関数（必要な場合のみ）
- **命名規則**: すべて kebab-case
- **注意**: Barrel files（`index.ts`）は禁止

#### 2.2.3 components/（再利用 UI）

- **責務**: 汎用 UI とレイアウト
- **分類**:
  - `components/ui/`: shadcn/ui コンポーネント
  - `components/layout/`: Header / Footer 等
- **命名規則**: すべて kebab-case

#### 2.2.4 lib/（共有ロジック）

- **責務**: API クライアント、バリデーション、ドメインロジック
- **分類**:
  - `lib/api/`
  - `lib/validators/`
  - `lib/domain/`
  - `lib/env.ts`
  - `lib/utils.ts`

#### 2.2.5 hooks/（共有フック）

- **責務**: 複数 feature で使う共通フック（例: `use-debounce`）
- **命名規則**: すべて kebab-case

---

### 2.3 設計原則（責務分離・単一責任・複雑性制御）

#### 2.3.1 責務分離 / SRP

- **UI（features/\*/ui）**: 表示とユーザー操作の受付に限定（計算・通信・状態の保持は最小限）
- **Model（features/\*/model）**: データ取得・状態管理・副作用（UI から分離）
- **Domain（lib/domain）**: 純粋関数のみ（副作用なし、テスト可能）
- **Validator / API（lib/validators, lib/api）**: 型安全な境界（Zod で入力/出力を保証）
- **1 ファイル = 1 役割**: 巨大コンポーネント／万能フックは作らず分割する

#### 2.3.2 複雑性の上限

- **実装の複雑さは最小限**（必要性が薄い高度機能は段階的に後回し）
- **UI/UX を最優先**（品質向上に必要な場合のみ複雑化を許容）
- **派生指標・比較・レイヤー**は MVP 完了後に段階導入する

#### 2.3.3 Hooks 方針（useRef / useEffect）

- **原則として useRef / useEffect を使わない**
- **例外**: 外部ライブラリや DOM 直接操作が不可避な場合（例: MapLibre, Chart, focus 管理）
- **例外時のルール**: Client Component に隔離し、最小範囲で使用する

#### 2.3.4 型定義方針

- **any 禁止（原則）**
- **やむを得ず使用する場合**: 影響範囲を局所化し、理由をコメントで明記する

---

### 2.4 日本・東京前提（ローカライズ方針）

- **言語**: 日本語 UI を基本とする
- **単位**: メートル法（℃、m/s、mm）
- **タイムゾーン**: `Asia/Tokyo`
- **既定都市**: Tokyo
- **分類/指標**: 日本向けの表現に寄せる（暫定ルールで開始し、後から調整）

※分類や快適度の具体式は推測を含むため、MVP 実装後に調整する前提

---

## 3. ディレクトリ構成

**feature ベースの構成**

```
city-observatory/
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── globals.css
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── compare/
│       └── page.tsx
│
├── features/                     # 機能単位（feature）
│   ├── city-search/
│   │   ├── ui/
│   │   │   ├── city-search-input.tsx
│   │   │   └── city-suggestions.tsx
│   │   └── model/
│   │       └── use-city-search.ts
│   ├── weather/
│   │   ├── ui/
│   │   │   ├── weather-card.tsx
│   │   │   ├── weather-chart.tsx
│   │   │   └── weather-table.tsx
│   │   └── model/
│   │       └── use-weather-data.ts
│   ├── air-quality/
│   │   ├── ui/
│   │   │   ├── aq-card.tsx
│   │   │   └── aq-chart.tsx
│   │   └── model/
│   │       └── use-air-quality-data.ts
│   ├── map/
│   │   └── ui/
│   │       ├── map-view.tsx
│   │       ├── map-view-client.tsx
│   │       └── map-controls.tsx
│   └── compare/
│       └── ui/
│           └── compare-view.tsx
│
├── components/                   # 再利用UI
│   ├── ui/                       # shadcn/ui
│   └── layout/                   # header / footer / error-boundary
│
├── hooks/                        # 共有フック（必要最小限）
│   └── use-debounce.ts
│
├── lib/                          # 共有ロジック
│   ├── api/
│   ├── validators/
│   ├── domain/
│   ├── types/
│   ├── store/
│   ├── env.ts
│   └── utils.ts
│
├── public/
├── docs/
├── tests/
└── package.json
```

**命名規則（coding-guidelines 準拠）**:

- 全てのディレクトリ・ファイル: **kebab-case**
- コンポーネントファイル: `component-name.tsx`
- フックファイル: `use-hook-name.ts`
- 型定義ファイル: `types.ts`
- Barrel files（`index.ts`）: **禁止**

---

## 4. 環境変数設計

### 4.1 環境変数一覧

#### .env.local（ローカル開発用）

```bash
# MapTiler（地図タイル）
NEXT_PUBLIC_MAPTILER_KEY=your_dev_key_here

# OpenWeather（降水レイヤー）
NEXT_PUBLIC_OPENWEATHER_KEY=your_dev_key_here

# 地図スタイルURL
NEXT_PUBLIC_MAP_STYLE_LIGHT=https://api.maptiler.com/maps/streets-v2/style.json
NEXT_PUBLIC_MAP_STYLE_DARK=https://api.maptiler.com/maps/streets-v2-dark/style.json

# デフォルト都市
NEXT_PUBLIC_DEFAULT_CITY=tokyo

# 機能フラグ
NEXT_PUBLIC_FEATURE_MAP=true

# 監視（任意）
NEXT_PUBLIC_SENTRY_DSN=
```

#### .env.example（Git にコミット）

```bash
# MapTiler API Key（DEV/PROD分ける）
NEXT_PUBLIC_MAPTILER_KEY=

# OpenWeather API Key
NEXT_PUBLIC_OPENWEATHER_KEY=

# Map Styles
NEXT_PUBLIC_MAP_STYLE_LIGHT=
NEXT_PUBLIC_MAP_STYLE_DARK=

# Defaults
NEXT_PUBLIC_DEFAULT_CITY=tokyo

# Feature Flags
NEXT_PUBLIC_FEATURE_MAP=true

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=
```

#### .env.production（本番用・ローカル検証向け）

```bash
# MapTiler API Key（PROD）
NEXT_PUBLIC_MAPTILER_KEY=your_prod_key_here

# OpenWeather API Key
NEXT_PUBLIC_OPENWEATHER_KEY=your_prod_key_here

# Map Styles
NEXT_PUBLIC_MAP_STYLE_LIGHT=https://api.maptiler.com/maps/streets-v2/style.json
NEXT_PUBLIC_MAP_STYLE_DARK=https://api.maptiler.com/maps/streets-v2-dark/style.json

# Defaults
NEXT_PUBLIC_DEFAULT_CITY=tokyo

# Feature Flags
NEXT_PUBLIC_FEATURE_MAP=true
```

### 4.2 Vercel 環境変数設定

**Preview 環境**:

- `NEXT_PUBLIC_MAPTILER_KEY`: DEV キー（localhost + \*.vercel.app 許可）
- `NEXT_PUBLIC_OPENWEATHER_KEY`: DEV キー

**Production 環境**:

- `NEXT_PUBLIC_MAPTILER_KEY`: PROD キー（本番 URL のみ許可）
- `NEXT_PUBLIC_OPENWEATHER_KEY`: PROD キー

### 4.3 環境変数の型定義

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_MAPTILER_KEY: z.string().min(1),
  NEXT_PUBLIC_OPENWEATHER_KEY: z.string().min(1),
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
  NEXT_PUBLIC_OPENWEATHER_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_KEY,
  NEXT_PUBLIC_MAP_STYLE_LIGHT: process.env.NEXT_PUBLIC_MAP_STYLE_LIGHT,
  NEXT_PUBLIC_MAP_STYLE_DARK: process.env.NEXT_PUBLIC_MAP_STYLE_DARK,
  NEXT_PUBLIC_DEFAULT_CITY: process.env.NEXT_PUBLIC_DEFAULT_CITY,
  NEXT_PUBLIC_FEATURE_MAP: process.env.NEXT_PUBLIC_FEATURE_MAP,
});
```

---

## 5. コンポーネント設計

### 5.1 コンポーネント分類原則

#### Server Component（デフォルト）

- 静的なレイアウト、ページ構造
- SEO が必要な部分
- データフェッチ（TanStack Query の初期化は除く）

#### Client Component（`"use client"`必須）

- インタラクティブな操作（onClick, onChange 等）
- ブラウザ API の使用（window, localStorage 等）
- **地図コンポーネント**（MapLibre GL JS）
- **チャートコンポーネント**（Recharts）
- TanStack Query のフック使用
- 状態管理フック使用

### 5.2 主要コンポーネント仕様

#### 5.2.1 CitySearchInput（Client Component）

**ファイル**: `features/city-search/ui/city-search-input.tsx`

**責務**: 都市名の入力とサジェスト表示

**Props**:

```typescript
type CitySearchInputProps = {
  onCitySelect: (city: Location) => void;
  placeholder?: string;
  defaultValue?: string;
};
```

**使用フック**:

- `useCitySearch(query)`: デバウンス付き都市検索

**状態**:

- `query: string` - 入力中のテキスト
- `isOpen: boolean` - サジェスト表示状態
- `selectedIndex: number` - キーボード選択中のインデックス

**キーボード操作**:

- ↓: 次の候補を選択
- ↑: 前の候補を選択
- Enter: 選択中の都市を確定
- Escape: サジェストを閉じる

---

#### 5.2.2 MapView（Client Component）

**ファイル**: `features/map/ui/map-view.tsx` (dynamic wrapper)
**ファイル**: `features/map/ui/map-view-client.tsx` (実装本体)

**責務**: MapLibre GL JS を使った地図表示

**Props**:

```typescript
type MapViewProps = {
  center: [number, number]; // [lng, lat]
  zoom?: number;
  style?: 'light' | 'dark';
  markers?: Array<{ lng: number; lat: number; label: string }>;
  onMapClick?: (lng: number; lat: number) => void;
};
```

**重要実装ポイント**:

```typescript
// features/map/ui/map-view.tsx
// SSR回避（dynamic import）
import dynamic from "next/dynamic";

export const MapView = dynamic(() => import("./map-view-client"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});
```

**クレジット表記**:

```typescript
// MapLibreが自動で追加する attributionControl を使用
const map = new maplibregl.Map({
  container: "map",
  style: styleUrl,
  center: center,
  zoom: zoom,
  attributionControl: true, // デフォルトで有効
});

// Freeプランの場合、MapTilerロゴを追加表示
// （位置: 左下、CSSで配置）
```

---

#### 5.2.3 WeatherChart（Client Component）

**ファイル**: `features/weather/ui/weather-chart.tsx`

**責務**: 時系列天気データのチャート表示

**Props**:

```typescript
type WeatherChartProps = {
  data: WeatherHourly | WeatherDaily;
  range: "24h" | "7d";
  dataKey: "temperature_2m" | "precipitation_probability" | "wind_speed_10m";
  title?: string;
};
```

**使用ライブラリ**: Recharts（shadcn/ui Chart）

**実装例**:

```typescript
"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// トップレベル関数はfunction宣言
export function WeatherChart({
  data,
  range,
  dataKey,
  title,
}: WeatherChartProps) {
  // 非トップレベルはアロー関数（useMemo内のmap）
  const chartData = useMemo(() => {
    return data.time.map((time, index) => ({
      time: formatTime(time, range),
      value: data[dataKey][index],
    }));
  }, [data, dataKey, range]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

#### 5.2.4 WeatherCard（Client/Server 両対応）

**ファイル**: `features/weather/ui/weather-card.tsx`

**責務**: 現在の天気情報をカード形式で表示

**Props**:

```typescript
type WeatherCardProps = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  icon?: string;
  isLoading?: boolean;
};
```

**レイアウト**:

- 大きく気温表示（主役）
- 体感温度（副情報）
- 湿度・風速・降水確率（アイコン付き）

---

## 6. データフロー設計

### 6.1 TanStack Query & Jotai 設定

**ファイル**: `app/providers.tsx`

```typescript
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider } from "jotai";

type ProvidersProps = {
  children: React.ReactNode;
};

// トップレベル関数はfunction宣言（coding-guidelines準拠）
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5分間はキャッシュを新鮮とみなす
            cacheTime: 10 * 60 * 1000, // 10分間キャッシュを保持
            retry: 2, // 失敗時2回までリトライ
            refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得を無効化
          },
        },
      })
  );

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </JotaiProvider>
  );
}
```

**Jotai Atoms 例** (グローバル状態が必要な場合のみ):

```typescript
// lib/store/map-state.ts
import { atom } from "jotai";

// 地図のスタイル状態（ライト/ダーク切替が複数コンポーネントで必要な場合）
export const mapStyleAtom = atom<"light" | "dark">("light");

// 地図のズームレベル（必要な場合のみ）
export const mapZoomAtom = atom<number>(10);
```

### 6.2 カスタムフック設計

#### useCitySearch（都市検索）

```typescript
// features/city-search/model/use-city-search.ts
import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/lib/api/geocoding";
import { useDebounce } from "@/hooks/use-debounce";

// トップレベル関数はfunction宣言
export function useCitySearch(query: string) {
  const debouncedQuery = useDebounce(query, 300); // 300ms遅延

  return useQuery({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => searchCities(debouncedQuery),
    enabled: debouncedQuery.length >= 2, // 2文字以上で検索
    staleTime: 30 * 60 * 1000, // 都市情報は30分キャッシュ
  });
}
```

#### useWeatherData（天気データ取得）

```typescript
// features/weather/model/use-weather-data.ts
import { useQuery } from "@tanstack/react-query";
import { getWeatherForecast } from "@/lib/api/weather";
import type { Location } from "@/lib/types/location";

// undefinedを優先（coding-guidelines準拠）
export function useWeatherData(
  location: Location | undefined,
  range: "24h" | "7d",
) {
  return useQuery({
    queryKey: ["weather", location?.id, range],
    queryFn: () => {
      if (!location) throw new Error("Location is required");
      return getWeatherForecast(location.lat, location.lon, range);
    },
    enabled: !!location,
    staleTime: 15 * 60 * 1000, // 天気は15分キャッシュ
    retry: (failureCount, error: any) => {
      // 429エラーは再試行しない
      if (error?.status === 429) return false;
      return failureCount < 2;
    },
  });
}
```

### 6.3 エラーハンドリング戦略

#### API エラーのカスタムクラス

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

// トップレベル関数はfunction宣言
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

#### エラーバウンダリ

```typescript
// components/layout/error-boundary.tsx
"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

// クラスコンポーネント（Error Boundaryはクラス必須）
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <p className="text-muted-foreground">エラーが発生しました</p>
            <Button onClick={() => this.setState({ hasError: false })}>
              再試行
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## 7. スタイリング設計

### 7.1 Tailwind CSS v4 カスタマイズ

**ファイル**: `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* カラーパレット（OKLCH色空間） */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(9.6% 0 0);

  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(9.6% 0 0);

  --color-primary: oklch(46.9% 0.22 264.05);
  --color-primary-foreground: oklch(98% 0 0);

  --color-secondary: oklch(96.1% 0 0);
  --color-secondary-foreground: oklch(9.6% 0 0);

  --color-muted: oklch(96.1% 0 0);
  --color-muted-foreground: oklch(45.3% 0 0);

  --color-accent: oklch(96.1% 0 0);
  --color-accent-foreground: oklch(9.6% 0 0);

  --color-destructive: oklch(57.6% 0.24 29.23);
  --color-destructive-foreground: oklch(98% 0 0);

  --color-border: oklch(89.8% 0 0);
  --color-input: oklch(89.8% 0 0);
  --color-ring: oklch(46.9% 0.22 264.05);

  /* ボーダーラディウス */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
}

@custom-variant dark (&:is(.dark *));

/* ダークモード */
.dark {
  --color-background: oklch(9.6% 0 0);
  --color-foreground: oklch(98% 0 0);
  /* 他のダークモード色定義... */
}
```

### 7.2 レスポンシブデザイン

**ブレークポイント**:

```typescript
// Tailwind デフォルト
sm: '640px'   // スマートフォン横向き
md: '768px'   // タブレット
lg: '1024px'  // ノートPC
xl: '1280px'  // デスクトップ
2xl: '1536px' // 大画面
```

**レイアウト方針**:

- **SP（〜md）**: 1 カラム、地図は折りたたみ or 縮小表示
- **PC（md〜）**: 2 カラム、左に情報パネル、右に地図

---

## 8. パフォーマンス最適化

### 8.1 コード分割戦略

#### 動的インポート（地図・チャート）

```typescript
// 地図コンポーネント
import dynamic from "next/dynamic";

export const MapView = dynamic(() => import("./map-view-client"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// チャートコンポーネント
export const WeatherChart = dynamic(
  () => import("./weather-chart").then((mod) => mod.WeatherChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);
```

#### ルートベースの分割

Next.js App Router が自動で各ページをコード分割

### 8.2 画像最適化

```typescript
import Image from "next/image";

<Image
  src="/images/city-thumbnail.jpg"
  alt="Tokyo skyline"
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>;
```

### 8.3 メモ化

```typescript
import { useMemo, useCallback } from "react";

// 重い計算のメモ化
const comfortScore = useMemo(() => {
  return calculateComfortScore(weather, airQuality);
}, [weather, airQuality]);

// コールバックのメモ化
const handleCitySelect = useCallback((city: Location) => {
  // 処理...
}, []);
```

### 8.4 バンドルサイズ最適化

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
```

---

## 9. テスト戦略

### 9.1 ユニットテスト（Vitest）

**対象**: ドメインロジック、ユーティリティ関数

**例**: 快適度スコア算出のテスト

```typescript
// tests/unit/domain/comfort-score.test.ts
import { describe, it, expect } from "vitest";
import { calculateComfortScore } from "@/lib/domain/comfort-score";

describe("calculateComfortScore", () => {
  it("理想的な条件で高スコアを返す", () => {
    const score = calculateComfortScore({
      temperature: 22,
      humidity: 50,
      windSpeed: 2,
      precipitation: 0,
      pm25: 10,
    });
    expect(score).toBeGreaterThan(80);
  });

  it("高温・高湿度で低スコアを返す", () => {
    const score = calculateComfortScore({
      temperature: 35,
      humidity: 90,
      windSpeed: 0.5,
      precipitation: 0,
      pm25: 10,
    });
    expect(score).toBeLessThan(40);
  });

  it("高PM2.5でスコアが減点される", () => {
    const baseScore = calculateComfortScore({
      temperature: 22,
      humidity: 50,
      windSpeed: 2,
      precipitation: 0,
      pm25: 10,
    });
    const highPM25Score = calculateComfortScore({
      temperature: 22,
      humidity: 50,
      windSpeed: 2,
      precipitation: 0,
      pm25: 100,
    });
    expect(highPM25Score).toBeLessThan(baseScore);
  });
});
```

### 9.2 E2E テスト（Playwright）

**対象**: ユーザーシナリオ

**例**: 都市検索 → ダッシュボード表示

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from "@playwright/test";

test("都市検索してダッシュボードが表示される", async ({ page }) => {
  // Landingページにアクセス
  await page.goto("/");

  // 検索ボックスに入力
  const searchInput = page.locator('[data-testid="city-search-input"]');
  await searchInput.fill("Tokyo");

  // サジェストが表示されるまで待機
  await page.waitForSelector('[data-testid="city-suggestion"]');

  // 最初の候補をクリック
  await page.locator('[data-testid="city-suggestion"]').first().click();

  // ダッシュボードページに遷移
  await expect(page).toHaveURL(/\/dashboard/);

  // 天気カードが表示される
  await expect(page.locator('[data-testid="weather-card"]')).toBeVisible();

  // チャートが表示される
  await expect(page.locator('[data-testid="weather-chart"]')).toBeVisible();

  // 地図が表示される（機能フラグがONの場合）
  if (process.env.NEXT_PUBLIC_FEATURE_MAP === "true") {
    await expect(page.locator('[data-testid="map-view"]')).toBeVisible();
  }
});
```

---

## 10. セキュリティ対策

### 10.1 環境変数の保護

- **NEXT*PUBLIC*** プレフィックス付きは公開される前提
- MapTiler API キーは **Allowed HTTP origins** で保護
- 秘密情報は絶対に `NEXT_PUBLIC_` にしない

### 10.2 XSS 対策

- React のデフォルトエスケープに依存
- `dangerouslySetInnerHTML` は使用禁止
- ユーザー入力は必ずサニタイズ（該当箇所なし、検索クエリはエスケープ済み）

### 10.3 CSP（Content Security Policy）

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Vercel Analytics等で必要
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.open-meteo.com https://api.maptiler.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
```

### 10.4 依存関係の脆弱性チェック

```bash
# 定期実行
pnpm audit

# または Snyk等の自動チェックツール導入
```

---

## 11. デプロイ設定

### 11.1 Vercel 設定

**vercel.json**（任意、必要に応じて）:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### 11.2 環境変数（Vercel Dashboard）

**Preview 環境**:

- `NEXT_PUBLIC_MAPTILER_KEY`: DEV キー
- `NEXT_PUBLIC_OPENWEATHER_KEY`: DEV キー
- 他の環境変数も同様に設定

**Production 環境**:

- `NEXT_PUBLIC_MAPTILER_KEY`: PROD キー（本番 URL のみ許可）
- `NEXT_PUBLIC_OPENWEATHER_KEY`: PROD キー
- 他の環境変数も同様に設定

### 11.3 ビルド最適化

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // "X-Powered-By: Next.js" ヘッダーを削除
  compress: true, // gzip圧縮を有効化
  images: {
    formats: ["image/avif", "image/webp"],
  },
};
```

---

## 12. クレジット表記要件

### 12.1 OpenStreetMap

**表示位置**: 地図右下（MapLibre attributionControl）

**表示内容**:

```html
©
<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
```

### 12.2 MapTiler

**表示位置**: 地図右下（attributionControl）+ Free プランはロゴ表示

**表示内容**:

```html
© <a href="https://www.maptiler.com/copyright/">MapTiler</a>
```

**Free プランロゴ**:

```tsx
// features/map/ui/map-view-client.tsx内
<div className="absolute bottom-2 left-2 z-10">
  <a href="https://www.maptiler.com" target="_blank" rel="noopener noreferrer">
    <img
      src="https://api.maptiler.com/resources/logo.svg"
      alt="MapTiler logo"
      className="h-6"
    />
  </a>
</div>
```

### 12.3 Open-Meteo

**表示位置**: フッター、または About モーダル

**表示内容**:

```html
Weather data by <a href="https://open-meteo.com/">Open-Meteo.com</a>
```

---

## 13. 今後の拡張性

### 13.1 機能拡張の余地

- [ ] ローカルストレージでお気に入り都市を保存
- [ ] PWA 化（オフライン対応、インストール可能）
- [ ] 多言語対応（i18n）
- [ ] ソーシャルシェア機能（Twitter/Facebook）
- [ ] アニメーション強化（Framer Motion 等）

### 13.2 技術スタック変更の可能性

- **状態管理**: Zustand/Jotai 導入（グローバル状態が増えた場合）
- **チャート**: ECharts への切り替え（より高度な可視化が必要な場合）
- **地図**: Mapbox GL JS（商用化する場合）

---

**最終更新**: 2026-01-31
**作成者**: haru
**バージョン**: 1.0
