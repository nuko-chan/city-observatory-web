import type { Metadata } from "next";

// page.tsx は Client Component で metadata を export できないため、
// このルートのメタ情報はレイアウト側に置く
export const metadata: Metadata = {
  title: "都市比較",
  description:
    "2都市の天気・大気質・快適度を横に並べて比較する。気温とPM2.5の推移、位置関係の地図つき。",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    url: "/compare",
    title: "都市比較 | City Observatory",
    description:
      "2都市の天気・大気質・快適度を横に並べて比較する。気温とPM2.5の推移、位置関係の地図つき。",
  },
};

export default function CompareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
