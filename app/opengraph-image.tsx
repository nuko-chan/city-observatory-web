import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 文言を英語にしているのは、ImageResponse の既定フォントが日本語の字形を持たず、
// 日本語を置くと欠字になるため。日本語にするならフォントを同梱する必要がある
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-2px" }}>
        {SITE.name}
      </div>
      <div style={{ marginTop: 24, fontSize: 40, color: "#a1a1a1" }}>
        Weather and air quality across six Japanese cities
      </div>
      <div style={{ marginTop: 48, fontSize: 28, color: "#7a7a7a" }}>
        Tokyo · Osaka · Nagoya · Sapporo · Fukuoka · Naha
      </div>
    </div>,
    size,
  );
}
