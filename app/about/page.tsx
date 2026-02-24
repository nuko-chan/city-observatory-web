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
                src="/nuko.png"
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
                  東京でWebアプリ開発のフリーランスをしています。
                </p>
              </div>
            </div>
          </div>

          {/* リンク集 */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              🔗 リンク
            </h2>
            <div className="space-y-3">
              <a
                href="https://github.com/nuko-chan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
              >
                <ExternalLink size={16} />
                <span>GitHub: @nuko-chan</span>
              </a>
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
            <p className="mt-4 text-sm text-muted-foreground">
              詳しいプロフィールや経験・スキルは{" "}
              <a
                href="https://github.com/nuko-chan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                GitHub
              </a>{" "}
              をご覧ください。
            </p>
          </div>

          {/* 連絡先 */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              💬 連絡先
            </h2>
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
  );
}
