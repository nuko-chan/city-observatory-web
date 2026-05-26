"use client";

import { memo, useEffect, useMemo, useState } from "react";

function useRealtimeClock(timeZone: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ja-JP", {
        timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      }),
    [timeZone],
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ja-JP", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [timeZone],
  );

  const datePart = dateFormatter.format(now);
  const timePart = timeFormatter.format(now);

  return { datePart, timePart };
}

export const RealtimeClock = memo(function RealtimeClock({
  timeZone,
}: {
  timeZone: string;
}) {
  const clock = useRealtimeClock(timeZone);

  return (
    <>
      <div className="text-sm text-muted-foreground">{clock.datePart}</div>
      <div className="font-mono text-xs text-muted-foreground [font-feature-settings:'tnum']">
        {clock.timePart}
      </div>
    </>
  );
});
