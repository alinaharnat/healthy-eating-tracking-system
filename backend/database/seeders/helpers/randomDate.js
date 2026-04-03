const SEED_BASELINE_UTC = new Date("2026-04-01T12:00:00.000Z");

export function seedDate({ daysAgo = 0, hour = 12, minute = 0 } = {}) {
  const date = new Date(SEED_BASELINE_UTC);
  date.setUTCDate(date.getUTCDate() - Number(daysAgo));
  date.setUTCHours(Number(hour), Number(minute), 0, 0);
  return date;
}
