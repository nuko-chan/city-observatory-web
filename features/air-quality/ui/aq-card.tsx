type AirQualityCardProps = {
  pm25: number;
  pm10: number;
  nitrogenDioxide: number;
  ozone: number;
  isLoading?: boolean;
  icon?: React.ReactNode;
};

type AirQualityLabel = "good" | "moderate" | "unhealthy" | "hazardous";

const labelMap: Record<AirQualityLabel, string> = {
  good: "良い",
  moderate: "注意",
  unhealthy: "悪い",
  hazardous: "危険",
};

function getAirQualityLabel(pm25: number): AirQualityLabel {
  if (pm25 <= 12) return "good";
  if (pm25 <= 35.4) return "moderate";
  if (pm25 <= 55.4) return "unhealthy";
  return "hazardous";
}

export function AirQualityCard({
  pm25,
  pm10,
  nitrogenDioxide,
  ozone,
  isLoading = false,
  icon,
}: AirQualityCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
        <div className="mt-4 h-10 w-32 animate-pulse rounded-md bg-muted" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  const label = getAirQualityLabel(pm25);

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>空気の状態</span>
        <div className="flex items-center gap-2">
          {icon}
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
            {labelMap[label]}
          </span>
        </div>
      </div>
      <div className="mt-3 text-4xl font-semibold">
        {pm25.toFixed(1)}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          μg/m³
        </span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">PM2.5</div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>PM10</span>
          <span className="text-foreground">{pm10.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>NO2</span>
          <span className="text-foreground">{nitrogenDioxide.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>O3</span>
          <span className="text-foreground">{ozone.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
