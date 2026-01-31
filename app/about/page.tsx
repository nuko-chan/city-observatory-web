"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景グラデーション */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, hsl(200, 80%, 45%) 0%, hsl(200, 60%, 25%) 30%, transparent 65%)",
          }}
        />
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

          {/* 案件募集 */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              📢 案件募集中
            </h2>
            <p className="mb-4 text-muted-foreground">
              現在、新規案件を募集しています。お気軽にご連絡ください！
            </p>
            <p className="text-sm text-muted-foreground">2026年01月28日現在</p>
          </div>

          {/* 経験・スキル */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              💼 経験・スキル
            </h2>
            <div className="space-y-4 text-foreground">
              <div>
                <p className="font-semibold">開発経験: 2年6ヶ月</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>
                    • 直近1年:
                    フロントエンドリーダー（React）・バックエンド（Express）で認証/API実装
                  </li>
                  <li>• 要件定義、設計、実装、テスト、保守運用</li>
                  <li>• 技術選定、アーキテクチャ設計</li>
                  <li>• 新人指導、コードレビュー</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium">
                  主要技術: TypeScript, React, Express, Docker, AWS
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  今後の方向性:
                  フロントエンドの経験を活かしつつBFF/APIの領域を主軸にしていきたい。
                </p>
              </div>
            </div>
          </div>

          {/* リンク */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              🔗 リンク
            </h2>
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
          </div>

          {/* 連絡先 */}
          <div className="rounded-3xl border border-foreground/10 bg-background/50 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:bg-background/60 hover:shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              📬 連絡先
            </h2>
            <p className="text-muted-foreground">
              <a
                href="https://x.com/nukochan_123"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                X (Twitter)
              </a>{" "}
              のDMへお願いします
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
