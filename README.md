# City Observatory

日本の主要6都市の天気と大気質を1画面で可視化する Web アプリケーション。
数値を並べるのではなく、地図・時系列グラフ・派生指標を1画面に収めて、都市の状態を一目で読み取れることを設計の軸に置いている。

![City Observatory サンプル](public/sample.png)

本番URL: https://city-observatory.vercel.app/

## 📱 ページ構成

### 1. トップページ (`/`)

- 単一都市の詳細情報表示
- 天気カード（気温、湿度、風速、降水確率）
- 気温の推移グラフ（24時間）
- PM2.5推移グラフ（24時間）
- インタラクティブな地図（降水レイヤー切替可能）

### 2. 比較ページ (`/compare`)

- 2都市の並列比較表示
- 左右のカラムで各都市のデータを表示
- 位置関係を示す地図
- データドリブンな背景（2都市の気温が混ざり合うグラデーション）

## 🚀 主要機能

- ✅ 6都市（東京/大阪/名古屋/札幌/福岡/那覇）の切り替え
- ✅ リアルタイムの天気・大気質データ表示
- ✅ 24時間の時系列グラフ
- ✅ 2都市の並列比較
- ✅ 日本語対応の地図表示
- ✅ 降水レイヤーの切替
- ✅ レスポンシブデザイン（デスクトップ/モバイル対応）

## 🛠 技術スタック

- **Next.js 16**（App Router）+ **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**（New York スタイル）
- **MapLibre GL**（地図）/ **Recharts**（グラフ）
- **TanStack Query**（データ取得）/ **Jotai**（グローバル状態）
- **Vitest**（ユニットテスト）/ ESLint / Prettier / Husky

依存の全量とアーキテクチャは[技術仕様書](docs/technical-specifications.md)、利用している外部 API の詳細は[API 仕様書](docs/api-specifications.md)にある。

## 📦 開発環境のセットアップ

### 前提条件

- Node.js 20.9以上（Next.js 16 の要件）
- pnpm 10以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/nemonsoon/city-observatory-web.git
cd city-observatory-web

# 依存関係をインストール
pnpm install

# 環境変数を設定
cp .env.example .env.local
# .env.localを編集してAPIキーを設定
```

### 開発サーバーの起動

```bash
pnpm dev
```

http://localhost:3000 でアプリケーションが起動する。

### その他のコマンド

```bash
pnpm build       # プロダクションビルド
pnpm start       # プロダクションサーバー起動
pnpm test        # Vitestでユニットテストを実行
pnpm typecheck   # 型チェック
pnpm lint        # ESLint実行
pnpm lint:fix    # ESLintの自動修正
pnpm format      # Prettierの書式チェック
pnpm format:fix  # Prettierの自動整形
```

## 🔑 環境変数

`.env.*` に以下を設定してください：

```bash
# MapTiler API Key (https://www.maptiler.com/)
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_api_key

# OpenWeather API Key (https://openweathermap.org/)
NEXT_PUBLIC_OPENWEATHER_KEY=your_openweather_api_key

# 地図スタイル（日本語対応。未設定だと地図は表示されません）
NEXT_PUBLIC_MAP_STYLE_LIGHT=https://api.maptiler.com/maps/jp-mierune-streets/style.json

# デフォルト設定（省略時は tokyo）
NEXT_PUBLIC_DEFAULT_CITY=tokyo
```

## 📁 プロジェクト構造

```
city-observatory-web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ
│   └── compare/           # 比較ページ
├── features/              # 機能別コンポーネント
│   ├── weather/          # 天気関連
│   ├── air-quality/      # 大気質関連
│   └── map/              # 地図関連
├── components/           # 共通UIコンポーネント
│   └── ui/              # shadcn/uiコンポーネント
├── lib/                 # ユーティリティ・型定義
└── docs/                # ドキュメント
```

## 📚 ドキュメント

- [要件定義書](docs/requirements.md) - 機能要件・非機能要件・スコープ外。何を作ったのか全体像から知りたいときに最初に読む
- [技術仕様書](docs/technical-specifications.md) - 技術スタック・アーキテクチャ・環境変数・デプロイ。動かす前や構成を変えるときに読む
- [API 仕様書](docs/api-specifications.md) - 利用している外部 API の呼び出し方とエラーハンドリング方針。データ取得まわりを触るときに読む
- [デザインシステム](DESIGN.md) - 色・タイポグラフィ・コンポーネント・モーションの規約。画面を作る・直すときに読む
- [コーディング規約](docs/coding-guidelines.md) - TypeScript・React・命名の約束事。コードを書く前に読む
- [拡張機能仕様書](docs/enhancement-specifications.md) - 実装済み機能の詳細と未実装の拡張候補。どこまでできているか知りたいときに読む

## 🔄 開発フロー（Issue駆動）

### ブランチ管理

- ブランチ命名: `issue-<number>-<slug>`（例: `issue-10-map-view`）
- メインブランチ: `main`

### PR作成

- PRタイトル: `Issue #<number>: <短いタイトル>`
- PR本文: `Closes #<number>` を含める
- テンプレート: `.github/pull_request_template.md`

### GitHub CLI推奨コマンド

```bash
# Issue作成とブランチ作成
gh issue develop <number> -b issue-<number>-<slug>

# PR作成
gh pr create -t "Issue #<number>: <title>" -b "Closes #<number>"
```

## 🙏 謝辞

- [Open-Meteo](https://open-meteo.com/) - 天気・大気質データ
- [MapTiler](https://www.maptiler.com/) - 地図タイル
- [MIERUNE](https://mierune.co.jp/) - 日本語地図スタイル
- [OpenWeather](https://openweathermap.org/) - 降水レイヤー
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
