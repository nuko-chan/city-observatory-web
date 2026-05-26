import type { TemperatureColor } from "@/lib/utils/formatting";
import { temperatureHsl } from "@/lib/utils/formatting";

type MeshGradientBackgroundProps = {
  color: TemperatureColor;
  filterId?: string;
};

export function MeshGradientBackground({
  color,
  filterId = "noise",
}: MeshGradientBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <svg className="absolute h-0 w-0">
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="5"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div
        className="absolute inset-0 opacity-50 transition-all duration-1000"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, ${temperatureHsl(color, "28%")} 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, ${temperatureHsl(color, "22%")} 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, ${temperatureHsl(color, "18%")} 0%, transparent 60%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `
            radial-gradient(circle at 60% 40%, ${temperatureHsl({ ...color, hue: (color.hue + 30) % 360 }, "20%")} 0%, transparent 45%),
            radial-gradient(circle at 30% 70%, ${temperatureHsl({ ...color, hue: (color.hue + 340) % 360 }, "16%")} 0%, transparent 50%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
        style={{ filter: `url(#${filterId})` }}
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
  );
}
