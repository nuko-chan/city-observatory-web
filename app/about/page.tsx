"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ノイズテクスチャ付きメッシュグラデーション */}
      <div className="fixed inset-0 -z-10">
        {/* SVGノイズフィルター（強化版） */}
        <svg className="absolute h-0 w-0">
          <filter id="noise-about">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="5"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {/* Atmospheric Twilight: 大気の黄昏時の層を表現 */}
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background: `
              radial-gradient(circle at 15% 20%, hsl(230, 35%, 15%) 0%, transparent 45%),
              radial-gradient(ellipse at 80% 50%, hsl(260, 20%, 18%) 0%, transparent 50%),
              radial-gradient(circle at 40% 85%, hsl(15, 45%, 22%) 0%, transparent 55%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            background: `
              radial-gradient(circle at 60% 30%, hsl(25, 15%, 12%) 0%, transparent 42%),
              radial-gradient(ellipse at 20% 70%, hsl(230, 30%, 18%) 0%, transparent 48%)
            `,
          }}
        />

        {/* ノイズテクスチャオーバーレイ（強化） */}
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
          style={{ filter: "url(#noise-about)" }}
        />

        {/* ビネット効果（周辺を暗く） */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />

        {/* ベース背景 */}
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>

      <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-8 lg:px-12 lg:py-12">
        {/* ヘッダー */}
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
              About
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              👋 はじめまして
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/50 px-6 py-3 text-sm font-medium backdrop-blur-xl transition-all duration-300 hover:border-foreground/30 hover:bg-background/60 hover:shadow-lg hover:scale-105"
          >
            ← トップページへ
          </Link>
        </header>

        {/* メインコンテンツ */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {/* プロフィール */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <div className="flex items-center gap-6">
              <Image
                src="/cat.jpeg"
                alt="プロフィールアイコン"
                width={120}
                height={120}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-foreground/10 lg:h-32 lg:w-32"
              />
              <div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">
                  nuko-chan
                </h2>
                <p className="text-lg text-muted-foreground">
                  東京でWebアプリ開発のフリーランスをしています！
                </p>
              </div>
            </div>
          </div>

          {/* 経験・スキル */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              💼 経験・スキル
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                開発経験は2年6ヶ月ほど。約2年にわたってReact/TypeScriptを使った開発を複数案件で一貫して担当してきました。直近1年はフロントエンドリーダーとして技術選定やアーキテクチャ設計（モノレポ移行、FEアーキテクチャ設計など）に携わりつつ、バックエンドでもExpressを使った認証やAPI実装に関わっています。
              </p>
              <p>
                要件定義から設計、実装、テスト、保守運用まで一通り経験があり、新人指導やコードレビューも行ってきました。AI活用にも積極的で、Cursor/Claude
                Code/Geminiを業務に導入した経験があります。
              </p>
              <p>
                主な技術スタックはTypeScript、React、Express、Docker、AWSです（AWS
                SAA取得済み）。バックエンドの実務経験はまだ軽めですが、今後はフロントエンドの経験を活かしながら、BFFやAPIの領域をメインに活動していきたいと考えています。
              </p>
            </div>
          </div>

          {/* 案件募集中 */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              📢 案件募集中
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-2">基本条件</p>
                <ul className="space-y-1.5 text-sm list-none">
                  <li>・ 2026年2月16日から稼働開始できます</li>
                  <li>・ 週5稼働が基本ですが、週4も相談できます</li>
                  <li>・ 地方在住予定のため、フルリモートでお願いしています</li>
                  <li>
                    ・
                    契約期間は6ヶ月以上の長期を希望していますが、最短3ヶ月からでも相談可能です
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">希望する案件</p>
                <ul className="space-y-1.5 text-sm list-none">
                  <li>
                    ・
                    TypeScriptとReact（できればNext.js）を使った新規開発か大規模リファクタリング
                  </li>
                  <li>
                    ・
                    フロントエンド7割、バックエンド3割くらいのバランスだと理想的です
                  </li>
                  <li>
                    ・ Node.js（ExpressやHono）を使ったBFFやREST
                    API開発に携われると嬉しいです
                  </li>
                  <li>
                    ・
                    DB設計・SQL、認証認可あたりの経験を積める環境だとさらに良いです
                  </li>
                  <li>
                    ・
                    5名以上のチームで、PRレビュー文化がしっかりしていると助かります
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">あると嬉しい</p>
                <ul className="space-y-1.5 text-sm list-none">
                  <li>・ AWSやCI/CD改善に関われる</li>
                  <li>・ 技術的な意思決定にも参加できる</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">
                  対応が難しい領域
                </p>
                <p className="text-sm">
                  Vue.js/Angular/Nuxt.jsメイン、Node.js/TypeScript以外のバックエンド、ネイティブアプリ開発、週1以上の出社必須など
                </p>
              </div>
            </div>
          </div>

          {/* リンク・連絡先 */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              🔗 リンク・連絡先
            </h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <a
                  href="https://x.com/nukochan_123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink size={16} />
                  <span>X (Twitter): @nukochan_123</span>
                </a>
                <a
                  href="https://nuko-chan.pages.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink size={16} />
                  <span>技術ブログ: nuko-chan.pages.dev</span>
                </a>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                案件のご相談は{" "}
                <a
                  href="https://x.com/nukochan_123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  X (Twitter)
                </a>{" "}
                のDMでお気軽にどうぞ！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
