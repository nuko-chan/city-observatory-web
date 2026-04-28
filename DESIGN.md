# City Observatory Design System

Vercel の精密なモノクロ基盤と Sentry のデータ監視ダッシュボード美学を統合し、
都市大気観測アプリ固有の「環境的グラスモーフィズム」を加えたデザインシステム。

## 1. Visual Theme & Atmosphere

City Observatory は「大気を観る」アプリケーションであり、UIそのものが大気を表現する。深いモノクロ基盤の上に、気温データから導出されるダイナミックグラデーションが重なり、グラスモーフィズムのカードがその上に浮遊する——三層構造がこのアプリの視覚的アイデンティティである。

Vercel の Geist フォントシステムが知的な精密さを、Sentry のデータ密度最適化パターンが情報の読みやすさを担保する。純粋なモノクロでもなく、過剰な装飾でもない——データが語り、UIはそれを邪魔しない。

**Key Characteristics:**

- OKLCH色空間による知覚均一なカラーシステム（Vercel の hex 精密さを OKLCH で再解釈）
- Geist Sans の負 letter-spacing（display: -2.4px）で圧縮された見出し（Vercel 由来）
- uppercase + letter-spacing 技術ラベルパターン（Sentry 由来）でデータ指標を表示
- 三層深度: SVGノイズ背景 → 気温連動グラデーション → グラスモーフィズムカード
- shadow-as-border（Vercel）+ frosted glass（Sentry）の統合深度システム
- 環境セマンティックカラー（AQI、UV、快適度）で状態を即座に伝達
- ダーク/ライト完全対応、ダークモードが主要体験

## 2. Color Palette & Roles

### Foundation (Vercel-derived Monochrome in OKLCH)

| Name                 | Light              | Dark                 | Role                                  |
| -------------------- | ------------------ | -------------------- | ------------------------------------- |
| **Background**       | `oklch(1 0 0)`     | `oklch(0.145 0 0)`   | ページ背景、最深層                    |
| **Foreground**       | `oklch(0.145 0 0)` | `oklch(0.985 0 0)`   | 主テキスト、見出し                    |
| **Card**             | `oklch(1 0 0)`     | `oklch(0.205 0 0)`   | カード背景（不透明時）                |
| **Muted**            | `oklch(0.97 0 0)`  | `oklch(0.269 0 0)`   | 控えめな表面、無効状態                |
| **Muted Foreground** | `oklch(0.556 0 0)` | `oklch(0.708 0 0)`   | 二次テキスト、説明文                  |
| **Border**           | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | 構造的境界（shadow-as-border で表現） |

### Environmental Semantic Colors (City Observatory 固有)

気象・大気データの状態を即座に伝える5段階カラーシステム。OKLCH で定義し、知覚的に均等な遷移を保証する。

| Level         | Name       | OKLCH Value            | Hex Approx | Use                            |
| ------------- | ---------- | ---------------------- | ---------- | ------------------------------ |
| 1 — Excellent | **Teal**   | `oklch(0.72 0.14 180)` | #2dd4a8    | AQI良好、UV低、快適度高        |
| 2 — Good      | **Sky**    | `oklch(0.75 0.12 220)` | #5cb8f0    | AQI普通、UV中低                |
| 3 — Moderate  | **Amber**  | `oklch(0.80 0.16 85)`  | #e8b230    | AQI やや悪い、UV中、注意レベル |
| 4 — Poor      | **Orange** | `oklch(0.72 0.19 55)`  | #e87830    | AQI悪い、UV高、警告レベル      |
| 5 — Hazardous | **Red**    | `oklch(0.62 0.24 25)`  | #dc3545    | AQI危険、UV極高、危険レベル    |

### Chart Colors (Data Visualization)

| Slot        | Light Mode                  | Dark Mode                    | Role                              |
| ----------- | --------------------------- | ---------------------------- | --------------------------------- |
| **Chart 1** | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` | 気温（暖色 → 寒色のコントラスト） |
| **Chart 2** | `oklch(0.6 0.118 184.704)`  | `oklch(0.696 0.17 162.48)`   | 湿度・降水                        |
| **Chart 3** | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)`   | PM2.5・大気質                     |
| **Chart 4** | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)`   | 風速                              |
| **Chart 5** | `oklch(0.769 0.188 70.08)`  | `oklch(0.645 0.246 16.439)`  | UV指数                            |

### Interactive (Vercel Focus System)

| Name            | Value                                                                  | Role                                                           |
| --------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Focus Ring**  | `oklch(0.62 0.21 255)`                                                 | キーボードフォーカスリング（Vercel の Focus Blue を OKLCH 化） |
| **Link**        | `oklch(0.62 0.18 255)`                                                 | リンクテキスト                                                 |
| **Destructive** | Light: `oklch(0.577 0.245 27.325)` / Dark: `oklch(0.704 0.191 22.216)` | エラー、破壊的アクション                                       |

### Dynamic Background (City Observatory 固有)

気温データから HSL hue を導出し、ビューポート全体にラジアルグラデーションを生成する。

```
背景レイヤー（奥→手前）:
1. SVG feTurbulence ノイズフィルター（opacity: 0.35, blend: soft-light）
2. 複数のラジアルグラデーション（hsl(bgColor, saturation%, lightness%)）
3. ビネット効果（radial-gradient → 黒フェード）
```

ライトモードではグラデーションの彩度を 15-25% に抑え、ダークモードでは 20-35% まで上げて大気感を演出する。

## 3. Typography Rules

### Font Family

- **Primary**: `Geist Sans` — `var(--font-geist-sans)` with fallbacks
- **Monospace**: `Geist Mono` — `var(--font-geist-mono)` with fallbacks
- **OpenType Features**: `"liga"` 有効（全 Geist テキスト）、`"tnum"` 有効（数値データ表示）

### Hierarchy

| Role            | Font       | Size            | Weight  | Line Height | Letter Spacing | Notes                                                            |
| --------------- | ---------- | --------------- | ------- | ----------- | -------------- | ---------------------------------------------------------------- |
| Display Hero    | Geist Sans | 48px (3rem)     | 600     | 1.00–1.17   | -2.4px         | 都市名、メイン気温表示                                           |
| Section Heading | Geist Sans | 32px (2rem)     | 600     | 1.25        | -1.28px        | セクション見出し                                                 |
| Card Title      | Geist Sans | 24px (1.5rem)   | 600     | 1.33        | -0.96px        | カードタイトル                                                   |
| Body Large      | Geist Sans | 20px (1.25rem)  | 400     | 1.80        | normal         | 説明文、サブテキスト                                             |
| Body            | Geist Sans | 16px (1rem)     | 400     | 1.50        | normal         | 標準テキスト                                                     |
| Body Medium     | Geist Sans | 16px (1rem)     | 500     | 1.50        | normal         | ナビゲーション、強調                                             |
| Data Label      | Geist Sans | 12px (0.75rem)  | 500     | 1.33        | 0.2px          | `text-transform: uppercase`、気象データラベル（Sentry パターン） |
| Data Value      | Geist Mono | 24–48px         | 600     | 1.00        | -0.5px         | `"tnum"` 有効、メトリクス数値表示                                |
| Data Unit       | Geist Mono | 14px (0.875rem) | 400     | 1.00        | normal         | °C, %, μg/m³ 等の単位表記                                        |
| Metric Small    | Geist Mono | 12px (0.75rem)  | 500     | 1.00        | normal         | `text-transform: uppercase`、技術ラベル                          |
| Button          | Geist Sans | 14px (0.875rem) | 500     | 1.43        | normal         | ボタンテキスト                                                   |
| Caption         | Geist Sans | 12px (0.75rem)  | 400–500 | 1.33        | normal         | メタデータ、タイムスタンプ                                       |

### Principles

- **Vercel 由来の圧縮**: display サイズで -2.4px、サイズ低下に伴い緩和（-1.28px → -0.96px → normal）
- **Sentry 由来の技術ラベル**: `Data Label` と `Metric Small` は uppercase + letter-spacing 0.2px。気温、湿度、AQI などの指標ラベルに適用し、「監視ダッシュボード」の質感を出す
- **三ウェイト制**: 400（本文）、500（UI/インタラクション）、600（見出し/強調）——Vercel と同一
- **Mono for metrics**: 数値データは全て Geist Mono + `"tnum"`（タブラー数字）。数値が縦に並ぶ際の桁揃えを保証
- **リガチャ有効**: 全 Geist テキストで `font-feature-settings: "liga"` を有効化

## 4. Component Stylings

### Cards (Glassmorphic — City Observatory 固有 + Vercel shadow)

**Standard Data Card**

```css
.card {
  background: oklch(from var(--background) l c h / 50%); /* 半透明背景 */
  backdrop-filter: blur(40px) saturate(150%);
  border: none; /* shadow-as-border で代替 */
  box-shadow:
    0px 0px 0px 1px oklch(from var(--foreground) l c h / 10%),
    /* Vercel ring-border */ 0px 2px 4px
      oklch(from var(--foreground) l c h / 4%); /* 微小な浮遊感 */
  border-radius: var(--radius-3xl); /* 1.375rem ≈ 22px */
  padding: 1.5rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow:
    0px 0px 0px 1px oklch(from var(--foreground) l c h / 20%),
    0px 8px 24px oklch(from var(--foreground) l c h / 8%);
  transform: translateY(-4px);
  background: oklch(from var(--background) l c h / 60%);
}
```

**Metric Card (Sentry data-dense パターン)**

```
┌─────────────────────────────┐
│  TEMPERATURE          ← Data Label (uppercase, 12px, 0.2px spacing)
│  24.5°C               ← Data Value (Geist Mono, 48px, weight 600)
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔    ← Sparkline or mini chart
│  前日比 +2.1°C  湿度 65%  ← Caption (12px, muted-foreground)
└─────────────────────────────┘
```

**Status Badge (Environmental Semantic)**

```css
.badge-status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px; /* Full pill — Vercel badge pattern */
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase; /* Sentry label pattern */
  letter-spacing: 0.2px;
  /* 背景色は Environmental Semantic Level に応じて変化 */
  /* Level 1: oklch(0.72 0.14 180 / 15%) with oklch(0.72 0.14 180) text */
  /* Level 5: oklch(0.62 0.24 25 / 15%) with oklch(0.62 0.24 25) text */
}
```

### Buttons

**Primary (Vercel Dark)**

```css
.btn-primary {
  background: var(--foreground);
  color: var(--background);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem; /* 6px — Vercel standard */
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0px 0px 0px 1px oklch(from var(--foreground) l c h / 80%);
  transition: all 200ms;
}
```

**Pill Toggle (City Selection)**

```css
.btn-pill {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid oklch(from var(--foreground) l c h / 20%);
  background: oklch(from var(--background) l c h / 50%);
  backdrop-filter: blur(16px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 300ms;
}

.btn-pill:hover {
  border-color: oklch(from var(--foreground) l c h / 30%);
  background: oklch(from var(--background) l c h / 60%);
  box-shadow: 0px 4px 12px oklch(from var(--foreground) l c h / 8%);
  transform: scale(1.05);
}

.btn-pill[data-active="true"] {
  background: var(--foreground);
  color: var(--background);
  border-color: transparent;
}
```

**Range Toggle (Chart Period: 24h / 7d)**

```css
.btn-range {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase; /* Sentry pattern */
  letter-spacing: 0.2px;
}
```

### Inputs

**City Search**

```css
.input-search {
  background: oklch(from var(--background) l c h / 50%);
  backdrop-filter: blur(16px);
  border: none;
  box-shadow: 0px 0px 0px 1px oklch(from var(--foreground) l c h / 10%); /* Vercel shadow-border */
  border-radius: 9999px; /* Full pill for search */
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 200ms;
}

.input-search:focus {
  box-shadow:
    0px 0px 0px 1px oklch(from var(--foreground) l c h / 20%),
    0px 0px 0px 3px oklch(0.62 0.21 255 / 30%); /* Focus ring — Vercel pattern */
}
```

### Navigation

- 背景: 透明（コンテンツの上にオーバーレイ）
- フォント: Geist Sans 14px weight 500
- テキスト色: foreground
- アクティブ: weight 600 or underline
- ダークモード: 同一（foreground/background が反転するため自動対応）

### Charts (Recharts)

- 背景: 透明（カード内に配置）
- グリッド線: `oklch(from var(--foreground) l c h / 8%)`
- 軸テキスト: Geist Mono 12px weight 400, muted-foreground
- ツールチップ: glassmorphic カードと同じ背景処理
- カーソル線: `oklch(from var(--foreground) l c h / 20%)`

### Map (MapLibre GL)

- コントロールボタン: glassmorphic（btn-pill と同様の処理）
- マーカー: Environmental Semantic Color でドット表示
- オーバーレイトグル: btn-range パターン

## 5. Layout Principles

### Spacing System (8px base)

| Token      | Value | Use                          |
| ---------- | ----- | ---------------------------- |
| `space-1`  | 4px   | アイコンとテキストのギャップ |
| `space-2`  | 8px   | カード内の要素間             |
| `space-3`  | 12px  | コンパクトなグルーピング     |
| `space-4`  | 16px  | 標準パディング               |
| `space-6`  | 24px  | カードパディング (1.5rem)    |
| `space-8`  | 32px  | セクション間                 |
| `space-12` | 48px  | ページセクション間           |
| `space-16` | 64px  | 主要セクション分離           |

### Grid & Container

**Home (/):**

```
┌─────────────────────────────────────────────────┐
│  Header: City Selection Pills                   │
├──────────────────────┬──────────────────────────┤
│                      │                          │
│  Data Cards          │  Map (sticky)            │
│  (scrollable)        │                          │
│                      │                          │
│  ┌────────────────┐  │                          │
│  │ Weather Card   │  │                          │
│  └────────────────┘  │                          │
│  ┌────────────────┐  │                          │
│  │ UV Card        │  │                          │
│  └────────────────┘  │                          │
│  ┌────────────────┐  │                          │
│  │ Comfort Card   │  │                          │
│  └────────────────┘  │                          │
│  ┌────────────────┐  │                          │
│  │ Chart Card     │  │                          │
│  └────────────────┘  │                          │
│                      │                          │
└──────────────────────┴──────────────────────────┘
```

- Desktop: `lg:grid-cols-2`、左カラム (data cards) + 右カラム (sticky map)
- Container: `px-6 py-8` (mobile) → `lg:px-12 lg:py-12` (desktop)
- Card gap: `gap-6` (24px)

**Compare (/compare):**

```
┌─────────────────────────────────────────────────┐
│  Left City Select  │  Right City Select         │
├──────────────────────┬──────────────────────────┤
│  Left City Cards     │  Right City Cards        │
│  (mirror layout)     │  (mirror layout)         │
├──────────────────────┴──────────────────────────┤
│  Map (both cities)                              │
└─────────────────────────────────────────────────┘
```

- 背景グラデーション: 左右の都市の気温から独立に導出し、中央でブレンド

### Whitespace Philosophy

- **Vercel の「ギャラリー的空虚」**: セクション間に十分な余白（48px–64px）を確保し、データカードを呼吸させる
- **Sentry の「コンテンツアイランド」**: 各カードは自己完結した情報ブロック。カード内部は密、カード間は疎
- **圧縮されたテキスト、拡張された空間**: 見出しの負 letter-spacing とカード周囲の広い余白の対比

### Border Radius Scale

| Token          | Value  | Use                                    |
| -------------- | ------ | -------------------------------------- |
| `--radius-sm`  | 6px    | インプット、小さなインタラクティブ要素 |
| `--radius-md`  | 8px    | ボタン、ドロップダウン                 |
| `--radius-lg`  | 10px   | 基準値（`--radius`）                   |
| `--radius-xl`  | 14px   | 中型コンテナ                           |
| `--radius-2xl` | 18px   | 大型コンテナ                           |
| `--radius-3xl` | 22px   | データカード（メインカード）           |
| `--radius-4xl` | 26px   | フィーチャーカード                     |
| `pill`         | 9999px | バッジ、都市選択ボタン、検索入力       |

## 6. Depth & Elevation

| Level            | Treatment                                                | Use                                                             |
| ---------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| **L0 — Canvas**  | なし                                                     | ページ背景、ダイナミックグラデーション層                        |
| **L1 — Ring**    | `0px 0px 0px 1px oklch(foreground / 10%)`                | shadow-as-border（Vercel 技法）。全カード・コンテナのデフォルト |
| **L2 — Float**   | Ring + `0px 2px 4px oklch(foreground / 4%)`              | 静止状態のグラスモーフィズムカード                              |
| **L3 — Elevate** | Ring(20%) + `0px 8px 24px oklch(foreground / 8%)`        | ホバー状態、アクティブカード                                    |
| **L4 — Overlay** | `backdrop-filter: blur(40px) saturate(150%)` + L2 shadow | グラスモーフィズムオーバーレイ、ツールチップ                    |
| **Focus**        | `0px 0px 0px 3px oklch(0.62 0.21 255 / 30%)`             | キーボードフォーカスリング                                      |

### Shadow Philosophy

Vercel の multi-layer shadow stack と Sentry の frosted glass を統合:

- **Shadow-as-border**: CSS `border` を使わず `box-shadow: 0px 0px 0px 1px` で境界を表現。ボックスモデルに影響せず、border-radius との組み合わせが滑らか
- **Glassmorphism**: `background: oklch(... / 50%)` + `backdrop-filter: blur(40px)` で、背景のダイナミックグラデーションがカード越しにうっすら透ける
- **ホバー浮遊**: translateY(-4px) + shadow 拡大で「持ち上がる」感覚。duration-300 の cubic-bezier(0.4, 0, 0.2, 1)

## 7. Motion & Animation

### Page Load (Cascading Reveal)

```css
.animate-card-in {
  animation: card-in 700ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cascading delays */
.card:nth-child(1) {
  animation-delay: 0ms;
}
.card:nth-child(2) {
  animation-delay: 100ms;
}
.card:nth-child(3) {
  animation-delay: 200ms;
}
.card:nth-child(4) {
  animation-delay: 300ms;
}
```

### Hover States

- カード: `transition: all 300ms` — border opacity, background opacity, shadow, transform
- ボタン: `transition: all 200ms` — 素早いフィードバック
- リンク: `transition: color 150ms`

### Data Transitions

- チャートデータ切替（24h → 7d）: CSS transition で値をモーフ
- 都市切替: フェードアウト → フェードイン（duration-300）
- メトリクス値更新: Geist Mono の `"tnum"` により数値が滑らかに変化

### Principles

- **高インパクトの少数精鋭**: ページロード時のカスケードリビールが最もデライトを生む。散発的なマイクロインタラクションより効果的（Vercel 哲学）
- **目的のある動き**: 全アニメーションは情報伝達か空間関係の表現に奉仕する。装飾的な動きは排除
- **CSS ファースト**: アニメーションは CSS で完結。JS ライブラリは不要

## 8. Do's and Don'ts

### Do

- Geist Sans の display サイズで負 letter-spacing を使う（-2.4px at 48px, -1.28px at 32px）
- shadow-as-border（`0px 0px 0px 1px`）を CSS border の代わりに使う（Vercel 技法）
- データラベル（気温、湿度、AQI）に uppercase + letter-spacing 0.2px を適用する（Sentry パターン）
- 数値データに Geist Mono + `"tnum"` を使い、桁揃えを保証する
- Environmental Semantic Color は背景透過度 15% + テキスト色100% で使う（バッジ・ステータス）
- グラスモーフィズムカードは `backdrop-filter: blur(40px)` + 半透明背景で構成する
- ダーク/ライト両方で動作するよう OKLCH の `oklch(from var(--xxx) l c h / alpha)` を活用する
- ホバーで translateY(-4px) + shadow 拡大の「浮遊」効果を適用する
- `"liga"` を全 Geist テキストで有効にする

### Don't

- 純黒 `#000000` や純白 `#ffffff` を直接使わない——OKLCH 変数を経由する
- Geist 以外のフォントを導入しない（Rubik, Dammit Sans 等の Sentry フォントは不要）
- Environmental Semantic Color をデータ状態表示以外に装飾的に使わない
- カードに CSS `border` を使わない——必ず shadow-as-border で代替する
- 正の letter-spacing を Geist Sans に適用しない（常に負またはゼロ）
- weight 700 (bold) を本文に使わない——600 が最大（見出し・強調のみ）
- グラデーション背景の彩度を上げすぎない（ライトモード: max 25%, ダークモード: max 35%）
- pill radius (9999px) をプライマリアクションボタンに使わない——バッジ・トグルのみ
- 複数の Semantic Color を同一コンポーネント内で混ぜない

## 9. Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                   |
| ------- | ----------- | --------------------------------------------- |
| Mobile  | <640px      | 1カラム、カード縦積み、マップはカード下に配置 |
| Tablet  | 640–1024px  | 2カラム開始、マップ縮小表示                   |
| Desktop | 1024–1280px | 完全2カラム、マップ sticky                    |
| Large   | >1280px     | 余白拡大、コンテンツ max-width 維持           |

### Touch Targets

- ボタン最小サイズ: 44×44px（Apple HIG 準拠）
- 都市選択ピル: padding 0.5rem 1.5rem で十分なタップ領域
- チャート範囲トグル: padding 0.25rem 0.75rem（min-width: 44px）

### Collapsing Strategy

- Home 2カラム → 1カラム縦積み（カード群 → マップの順）
- Compare 2カラム → 1カラム（都市A → 都市B → マップの順）
- 見出し: 48px → 32px（mobile）、letter-spacing も比例縮小
- カードパディング: 1.5rem → 1rem
- セクション間: 64px → 32px
- グラデーション背景: 複雑度を下げ GPU 負荷を軽減

## 10. Agent Prompt Guide

### Quick Color Reference

```
Background:     var(--background)           oklch(1 0 0) / oklch(0.145 0 0)
Foreground:     var(--foreground)            oklch(0.145 0 0) / oklch(0.985 0 0)
Card glass:     oklch(from var(--background) l c h / 50%)
Border shadow:  oklch(from var(--foreground) l c h / 10%)
Hover shadow:   oklch(from var(--foreground) l c h / 20%)
Focus ring:     oklch(0.62 0.21 255 / 30%)

Semantic Teal:    oklch(0.72 0.14 180)     — excellent/good
Semantic Amber:   oklch(0.80 0.16 85)      — moderate/caution
Semantic Red:     oklch(0.62 0.24 25)      — hazardous/danger
```

### Example Component Prompts

- "Create a weather data card: glassmorphic background (oklch from background / 50%), backdrop-filter blur(40px), shadow-as-border (0px 0px 0px 1px foreground/10%), border-radius var(--radius-3xl). Uppercase 'TEMPERATURE' label at 12px Geist weight 500, letter-spacing 0.2px. Value '24.5°C' in Geist Mono 48px weight 600 with tnum. Hover: translateY(-4px), shadow expands."

- "Build an AQI status badge: pill shape (9999px radius), background oklch(0.72 0.14 180 / 15%), text oklch(0.72 0.14 180), 12px Geist weight 500 uppercase, letter-spacing 0.2px. Text: '良好'."

- "Design a city selection bar: horizontal pill buttons, inactive = glassmorphic with border foreground/20%, active = solid foreground background with background text color. Geist 14px weight 500. Hover on inactive: scale(1.05), shadow increase."

- "Create a chart card: glassmorphic card container. Inside: 12px uppercase label 'PM2.5 推移', then Recharts LineChart. Grid lines at foreground/8%, axis text in Geist Mono 12px muted-foreground. Range toggles (24H / 7D) as small pill buttons with uppercase text."

### Iteration Guide

1. 全ての border を shadow-as-border（`0px 0px 0px 1px`）で代替する
2. Letter-spacing はフォントサイズに比例: -2.4px(48px), -1.28px(32px), -0.96px(24px), 0(14px以下)
3. データラベルは常に: uppercase + letter-spacing 0.2px + weight 500 + 12px
4. 数値は常に: Geist Mono + `"tnum"` + weight 600
5. 状態色は背景透過15% + テキスト100%のペアで使う
6. Glassmorphism = `bg oklch(... / 50%)` + `backdrop-blur-[40px]` + shadow-as-border
7. ホバー = translateY(-4px) + border opacity 10%→20% + shadow 拡大 + bg opacity 50%→60%
