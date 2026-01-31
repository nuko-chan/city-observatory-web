# City Observatory

日本の主要6都市の天気情報を可視化しビジュアルで表現するWebアプリケーションです。

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

### 3. Aboutページ (`/about`)

- 開発者プロフィール
- 技術スタック
- 連絡先情報

## 🚀 主要機能

- ✅ 6都市（東京/大阪/名古屋/札幌/福岡/那覇）の切り替え
- ✅ リアルタイムの天気・大気質データ表示
- ✅ 24時間の時系列グラフ
- ✅ 2都市の並列比較
- ✅ 日本語対応の地図表示
- ✅ 降水レイヤーの切替
- ✅ レスポンシブデザイン（デスクトップ/モバイル対応）

## 🛠 技術スタック

### フロントエンド

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (New York スタイル)

### データ可視化

- **Recharts** - 折れ線グラフ
- **MapLibre GL** - 地図表示

### データソース

- **Open-Meteo API** - 天気データ
- **Open-Meteo Air Quality API** - 大気質データ
- **MapTiler + MIERUNE** - 日本語地図スタイル
- **OpenWeather** - 降水レイヤー

### 状態管理

- **TanStack Query (React Query)** - データフェッチング
- **Jotai** - グローバル状態管理

## 📦 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- pnpm 10以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/city-observatory.git
cd city-observatory

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

http://localhost:3000 でアプリケーションが起動します。

### その他のコマンド

```bash
pnpm build      # プロダクションビルド
pnpm start      # プロダクションサーバー起動
pnpm lint       # ESLint実行
pnpm typecheck  # 型チェック
```

## 🔑 環境変数

`.env.*` に以下を設定してください：

```bash
# MapTiler API Key (https://www.maptiler.com/)
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_api_key

# OpenWeather API Key (https://openweathermap.org/)
NEXT_PUBLIC_OPENWEATHER_KEY=your_openweather_api_key

# 地図スタイル（日本語対応）
NEXT_PUBLIC_MAP_STYLE_LIGHT=https://api.maptiler.com/maps/jp-mierune-streets/style.json
NEXT_PUBLIC_MAP_STYLE_DARK=https://api.maptiler.com/maps/jp-mierune-dark/style.json

# デフォルト設定
NEXT_PUBLIC_DEFAULT_CITY=tokyo
NEXT_PUBLIC_FEATURE_MAP=true
```

## 📁 プロジェクト構造

```
city-observatory/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ
│   ├── compare/           # 比較ページ
│   └── about/             # プロフィールページ
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

- `docs/requirements.md` - 要件定義
- `docs/technical-specifications.md` - 技術仕様
- `docs/coding-guidelines.md` - コーディング規約
- `CLAUDE.md` - AI開発ガイドライン

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

## 👤 開発者

**nuko-chan**

- X (Twitter): [@nukochan_123](https://x.com/nukochan_123)
- 技術ブログ: [nuko-chan.pages.dev](https://nuko-chan.pages.dev)

## 🙏 謝辞

- [Open-Meteo](https://open-meteo.com/) - 天気・大気質データ
- [MapTiler](https://www.maptiler.com/) - 地図タイル
- [MIERUNE](https://mierune.co.jp/) - 日本語地図スタイル
- [OpenWeather](https://openweathermap.org/) - 降水レイヤー
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
