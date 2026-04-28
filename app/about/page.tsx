"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ノイズテクスチャ付きメッシュグラデーション */}
      <div className="fixed inset-0 -z-10">
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

        {/* Atmospheric Twilight */}
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

        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
          style={{ filter: "url(#noise-about)" }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />

        <div className="absolute inset-0 -z-10 bg-background" />
      </div>

      <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-8 lg:px-12 lg:py-12">
        {/* ヘッダー */}
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between animate-card-in">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
              About
            </div>
            <h1 className="mt-2 text-[3rem] font-semibold leading-[1.17] tracking-[-2.4px] text-foreground">
              はじめまして
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-background/50 px-6 py-3 text-sm font-medium shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/20%)] backdrop-blur-[16px] transition-all duration-300 hover:scale-105 hover:bg-background/60 hover:shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/30%),0px_4px_12px_oklch(from_var(--foreground)_l_c_h/8%)]"
          >
            ← トップページへ
          </Link>
        </header>

        {/* メインコンテンツ */}
        <div className="space-y-6">
          <GlassCard
            className="animate-card-in p-8"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-6">
              <Image
                src="/nuko.png"
                alt="プロフィールアイコン"
                width={120}
                height={120}
                className="h-24 w-24 rounded-full object-cover shadow-[0px_0px_0px_4px_oklch(from_var(--foreground)_l_c_h/10%)] lg:h-32 lg:w-32"
              />
              <div>
                <h2 className="mb-2 text-[1.5rem] font-semibold tracking-[-0.96px] text-foreground">
                  nuko-chan
                </h2>
                <p className="text-lg text-muted-foreground">
                  東京でWebアプリ開発のフリーランスをしています。
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            className="animate-card-in p-8"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="mb-4 text-[1.5rem] font-semibold tracking-[-0.96px] text-foreground">
              リンク
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
          </GlassCard>

          <GlassCard
            className="animate-card-in p-8"
            style={{ animationDelay: "300ms" }}
          >
            <h2 className="mb-4 text-[1.5rem] font-semibold tracking-[-0.96px] text-foreground">
              連絡先
            </h2>
            <p className="leading-relaxed text-muted-foreground">
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
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
