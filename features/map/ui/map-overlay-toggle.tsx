"use client";

type MapOverlayToggleProps = {
  value: "none" | "precipitation";
  onChange: (value: "none" | "precipitation") => void;
};

export function MapOverlayToggle({ value, onChange }: MapOverlayToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md bg-background/80 p-1 text-xs shadow-[0px_0px_0px_1px_oklch(from_var(--foreground)_l_c_h/10%),0px_2px_4px_oklch(from_var(--foreground)_l_c_h/4%)] backdrop-blur-[40px]">
      <button
        type="button"
        onClick={() => onChange("none")}
        className={`rounded-md px-3 py-1 font-medium uppercase tracking-[0.2px] transition ${
          value === "none"
            ? "bg-foreground text-background shadow"
            : "text-muted-foreground"
        }`}
      >
        なし
      </button>
      <button
        type="button"
        onClick={() => onChange("precipitation")}
        className={`rounded-md px-3 py-1 font-medium uppercase tracking-[0.2px] transition ${
          value === "precipitation"
            ? "bg-foreground text-background shadow"
            : "text-muted-foreground"
        }`}
      >
        降水
      </button>
    </div>
  );
}
