import { toDate, toZonedTime } from "date-fns-tz";
import { invalidPeriod } from "../../core/errors/domain-errors.js";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function resolvePeriod({
  period,
  date,
  from,
  to,
  timezone = "UTC",
}: {
  period: string;
  date?: string;
  from?: string;
  to?: string;
  timezone?: string;
}) {
  const baseDate = date
    ? toZonedTime(new Date(`${date}T00:00:00`), timezone)
    : toZonedTime(new Date(), timezone);
  const today = startOfDay(baseDate);
  const tomorrow = addDays(today, 1);

  let start: Date;
  let end: Date = tomorrow;

  switch (period) {
    case "today":
      start = today;
      break;
    case "yesterday":
      start = addDays(today, -1);
      end = today;
      break;
    case "last_7_days":
      start = addDays(today, -6);
      break;
    case "last_28_days":
      start = addDays(today, -27);
      break;
    case "last_91_days":
      start = addDays(today, -90);
      break;
    case "this_month":
      start = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
      );
      break;
    case "last_month":
      start = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1),
      );
      end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
      break;
    case "this_year":
      start = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
      break;
    case "last_12_months":
      start = new Date(
        Date.UTC(
          today.getUTCFullYear() - 1,
          today.getUTCMonth(),
          today.getUTCDate(),
        ),
      );
      break;
    case "all_time":
      return {
        from: 0,
        to: Math.floor(tomorrow.getTime() / 1000),
      };
    case "custom":
      if (!from || !to) throw new Error("Custom range requires from & to");
      return {
        from: Math.floor(new Date(from).getTime() / 1000),
        to: Math.floor(addDays(new Date(to), 1).getTime() / 1000),
      };
    default:
      throw invalidPeriod(period);
  }

  return {
    from: Math.floor(toDate(start, { timeZone: timezone }).getTime() / 1000),
    to: Math.floor(toDate(end, { timeZone: timezone }).getTime() / 1000),
  };
}
