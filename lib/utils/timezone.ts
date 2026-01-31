export function toUtcDateFromLocalTime(
  value: string,
  utcOffsetSeconds?: number,
) {
  const timestamp = Date.parse(`${value}Z`);
  if (Number.isNaN(timestamp)) return undefined;
  const offsetMs = (utcOffsetSeconds ?? 0) * 1000;
  return new Date(timestamp - offsetMs);
}
