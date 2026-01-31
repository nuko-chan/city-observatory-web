"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CitySearchInput } from "@/features/city-search/ui/city-search-input";
import type { Location } from "@/lib/types/location";

const recommendedCities: Location[] = [
  {
    id: 1850144,
    name: "Tokyo",
    country: "Japan",
    lat: 35.6895,
    lon: 139.6917,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1853909,
    name: "Osaka",
    country: "Japan",
    lat: 34.6937,
    lon: 135.5023,
    timezone: "Asia/Tokyo",
  },
  {
    id: 2128295,
    name: "Sapporo",
    country: "Japan",
    lat: 43.0618,
    lon: 141.3545,
    timezone: "Asia/Tokyo",
  },
  {
    id: 1856057,
    name: "Nagoya",
    country: "Japan",
    lat: 35.1815,
    lon: 136.9066,
    timezone: "Asia/Tokyo",
  },
];

export default function Home() {
  const router = useRouter();

  const handleCitySelect = (city: Location) => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          City Observatory
        </div>
        <Link
          href="/"
          className="rounded-full border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground"
        >
          ダッシュボードへ
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-4">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              都市の今を観測する
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              今日の都市コンディションを
              <br />
              ひと目で把握するダッシュボード
            </h1>
            <p className="max-w-lg text-base text-muted-foreground">
              天気・大気質・地図をまとめてチェック。気になる都市を検索して、
              すぐにダッシュボードへ移動できます。
            </p>
            <CitySearchInput onCitySelect={handleCitySelect} />
          </div>

          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-medium text-muted-foreground">
              おすすめ都市
            </h2>
            <div className="mt-4 grid gap-3">
              {recommendedCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition hover:border-foreground"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {city.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {city.country}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border bg-background p-6 text-sm text-muted-foreground md:grid-cols-3">
          <div>
            <div className="text-base font-medium text-foreground">天気</div>
            <p className="mt-2">現在値と 24h/7d の流れを確認。</p>
          </div>
          <div>
            <div className="text-base font-medium text-foreground">大気質</div>
            <p className="mt-2">PM2.5 を中心に簡易ラベルで把握。</p>
          </div>
          <div>
            <div className="text-base font-medium text-foreground">地図</div>
            <p className="mt-2">選択都市を地図上で可視化。</p>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 pb-10 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>Weather data by Open-Meteo.com</div>
        <div className="flex flex-wrap gap-3">
          <a
            className="underline-offset-4 hover:underline"
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo
          </a>
          <a
            className="underline-offset-4 hover:underline"
            href="https://www.maptiler.com/copyright/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MapTiler
          </a>
          <a
            className="underline-offset-4 hover:underline"
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>
        </div>
      </footer>
    </div>
  );
}
