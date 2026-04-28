# City Observatory - 技術仕様書

## 1. 技術スタック

### 1.1 コア

| カテゴリ             | 技術                    | 用途                     |
| -------------------- | ----------------------- | ------------------------ |
| フレームワーク       | Next.js 16 (App Router) | React フレームワーク     |
| 言語                 | TypeScript 5 (strict)   | 型安全な開発             |
| UI                   | React 19                | ユーザーインターフェース |
| パッケージマネージャ | pnpm                    | 依存関係管理             |

### 1.2 スタイリング

| 技術                  | 用途                                   |
| --------------------- | -------------------------------------- |
| Tailwind CSS 4        | ユーティリティファースト CSS           |
| shadcn/ui             | UI コンポーネント（new-york スタイル） |
| cva                   | バリアント管理                         |
| clsx + tailwind-merge | クラス名結合                           |
| Geist Font            | フォント（Sans/Mono）                  |

### 1.3 データ・状態管理

| 技術              | 用途                         |
| ----------------- | ---------------------------- |
| TanStack Query v5 | サーバー状態管理・キャッシュ |
| jotai             | グローバル状態（最小限使用） |
| nuqs              | URL クエリパラメータ同期     |
| Zod v4            | スキーマバリデーション       |

### 1.4 地図・可視化

| 技術           | 用途                          |
| -------------- | ----------------------------- |
| MapLibre GL JS | インタラクティブ地図（WebGL） |
| Recharts       | チャート描画                  |
| lucide-react   | アイコン                      |
| next-themes    | ダーク/ライト切替             |

### 1.5 開発・品質

| 技術        | 用途                               |
| ----------- | ---------------------------------- |
| ESLint      | 静的解析                           |
| Prettier    | コードフォーマット                 |
| Husky       | Git hooks                          |
| lint-staged | ステージ済みファイルの自動チェック |
| Vitest      | ユニットテスト                     |
| Playwright  | E2E テスト                         |

---

## 2. アーキテクチャ

### 2.1 構成方針（Feature-Sliced Design）

```
city-observatory/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト（Geist fonts, providers）
│   ├── page.tsx                  # メインダッシュボード
│   ├── providers.tsx             # TanStack Query + Jotai + Theme
│   ├── globals.css               # Tailwind v4 + テーマ変数（OKLCH）
│   ├── not-found.tsx
│   ├── landing-page.tsx
│   ├── about/page.tsx
│   └── compare/page.tsx
│
├── features/                     # 機能単位（FSD）
│   ├── air-quality/
│   │   ├── model/use-air-quality-data.ts
│   │   └── ui/aq-card.tsx, aq-chart.tsx, aq-chart-client.tsx
│   ├── city-search/
│   │   ├── model/use-city-search.ts
│   │   └── ui/city-search-input.tsx, city-suggestions.tsx
│   ├── derived-metrics/
│   │   └── ui/comfort-summary-card.tsx
│   ├── map/
│   │   └── ui/map-view.tsx, map-view-client.tsx, map-overlay-toggle.tsx
│   └── weather/
│       ├── model/use-weather-data.ts, use-weather-snapshot.ts
│       └── ui/weather-card.tsx, weather-chart.tsx, sun-path-card.tsx,
│           uv-card.tsx, wind-card.tsx, weather-icon.tsx
│
├── components/                   # 共有 UI
│   ├── ui/button.tsx             # shadcn/ui
│   └── theme-provider.tsx
│
├── lib/                          # 共有ロジック
│   ├── api/                      # API クライアント（weather, air-quality, geocoding, errors）
│   ├── domain/                   # 純粋関数（comfort-score, sun-path, uv, wind, outdoor-risk 等）
│   ├── types/                    # 共有型定義
│   ├── validators/               # Zod スキーマ
│   ├── constants/cities.ts       # 固定都市データ
│   ├── utils.ts                  # cn() ヘルパー
│   ├── utils/                    # formatting, timezone
│   └── env.ts                    # 環境変数バリデーション
│
├── docs/                         # 仕様書
└── public/                       # 静的アセット
```

### 2.2 レイヤー構成

| レイヤー  | 場所                | 責務                                          |
| --------- | ------------------- | --------------------------------------------- |
| UI        | `features/*/ui/`    | 表示とユーザー操作。計算・通信は最小限        |
| Model     | `features/*/model/` | データ取得・状態管理（TanStack Query フック） |
| Domain    | `lib/domain/`       | 純粋関数のみ（副作用なし、テスト可能）        |
| API       | `lib/api/`          | 外部 API 通信 + Zod バリデーション            |
| Validator | `lib/validators/`   | Zod スキーマ定義                              |

### 2.3 設計原則

- **1 ファイル = 1 役割**: 巨大コンポーネント・万能フックは作らず分割
- **Server Component がデフォルト**: Client Component は `"use client"` を明示
- **useRef/useEffect は原則不使用**: 外部ライブラリ・DOM 操作が不可避な場合のみ（MapLibre 等）。Client Component に隔離
- **any 禁止**: やむを得ず使用する場合は局所化 + 理由コメント
- **Barrel files 禁止**: `index.ts` は作らない

---

## 3. 環境変数

### 必須

| 変数名                        | 用途                     |
| ----------------------------- | ------------------------ |
| `NEXT_PUBLIC_MAPTILER_KEY`    | MapTiler 地図タイル      |
| `NEXT_PUBLIC_OPENWEATHER_KEY` | OpenWeather 降水レイヤー |

### 任意

| 変数名                        | 用途                         | デフォルト      |
| ----------------------------- | ---------------------------- | --------------- |
| `NEXT_PUBLIC_MAP_STYLE_LIGHT` | ライトモード地図スタイル URL | streets-v2      |
| `NEXT_PUBLIC_MAP_STYLE_DARK`  | ダークモード地図スタイル URL | streets-v2-dark |
| `NEXT_PUBLIC_DEFAULT_CITY`    | 既定都市                     | tokyo           |

環境変数は `lib/env.ts` で Zod バリデーション済み。`.env.local` にセット（`.env.example` を参照）。

---

## 4. データフロー

### キャッシュ戦略（TanStack Query v5）

| データ種別 | staleTime | gcTime | 理由                 |
| ---------- | --------- | ------ | -------------------- |
| 都市検索   | 30 分     | 60 分  | 都市情報は変化しない |
| 天気予報   | 15 分     | 30 分  | 更新頻度が高い       |
| 大気質予報 | 15 分     | 30 分  | 更新頻度が高い       |
| 派生指標   | -         | -      | useMemo でメモ化     |

### エラーハンドリング

- `lib/api/errors.ts` の `APIError` クラスで統一
- 429 エラー: リトライしない、ユーザーに通知
- ネットワークエラー: 再試行ボタン表示
- TanStack Query の `retry` でリトライ制御（最大 2 回）

---

## 5. スタイリング

- **Tailwind CSS v4** + OKLCH 色空間の CSS 変数（`app/globals.css`）
- ダークモード: `@custom-variant dark (&:is(.dark *))` + `next-themes`
- デザイントークン: neutral ベースカラー、カスタマイズ可能なラディウス
- レスポンシブ: SP（〜md）は 1 カラム、PC（md〜）は 2 カラム

---

## 6. クレジット表記要件

| サービス      | 表記                                         | 位置                           |
| ------------- | -------------------------------------------- | ------------------------------ |
| OpenStreetMap | `© OpenStreetMap contributors`（リンク付き） | 地図右下（attributionControl） |
| MapTiler      | `© MapTiler`（リンク付き）+ Free プランロゴ  | 地図右下 + 左下ロゴ            |
| Open-Meteo    | `Weather data by Open-Meteo.com`             | フッター                       |

---

## 7. デプロイ

- **プラットフォーム**: Vercel（Free プラン）
- **ビルド**: `pnpm build`
- **環境変数**: Vercel Dashboard で Preview/Production を分けて設定
- **MapTiler キー保護**: Allowed HTTP Origins で制限（DEV: localhost + \*.vercel.app、PROD: 本番 URL のみ）

---

**最終更新**: 2026-04-28
**バージョン**: 2.0
