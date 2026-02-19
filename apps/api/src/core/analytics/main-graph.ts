import { fromUnixTime, addMinutes, addHours, addDays, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import {
  mainGraphAggQuery,
  mainGraphRealtimeQuery,
} from "../../db/clickhouse/main-graph.js";
import { AppContext } from "../context.js";

type Interval = "minute" | "hour" | "day" | "week" | "month";

export const validateInterval = (
  interval: Interval,
  from: number,
  to: number,
) => {
  const diff = to - from;

  if (interval === "minute" && diff > 60 * 60 * 6) return "hour";
  if (interval === "hour" && diff > 60 * 60 * 24 * 14) return "day";
  if (interval === "day" && diff > 60 * 60 * 24 * 180) return "month";

  return interval;
};

export const getSourceFromInterval = (interval: Interval) => {
  if (interval === "minute") return "sessions";
  if (interval === "hour") return "hourly";
  return "daily";
};

export const getMainGraph = async (
  { clickhouse }: AppContext,
  input: {
    websiteId: string;
    from: number;
    to: number;
    metric: string;
    interval: Interval;
  },
) => {
  const interval = validateInterval(input.interval, input.from, input.to);

  const source = getSourceFromInterval(interval);

  let rows;

  if (source === "sessions") {
    rows = await mainGraphRealtimeQuery(
      clickhouse,
      input.websiteId,
      input.from,
      input.to,
      input.metric,
    );
  } else {
    rows = await mainGraphAggQuery(
      clickhouse,
      input.websiteId,
      input.from,
      input.to,
      input.metric,
      interval,
      source,
    );
  }

  console.log("rows", rows);

  const graph = buildGraph(rows, input.from, input.to, interval);

  return {
    labels: graph.labels,
    plot: graph.plot,
    metric: input.metric,
    comparison_labels: null,
    comparison_plot: null,
    present_index: null,
  };
};

export const buildGraph = (
  rows: { t: string; value: string }[],
  from: number,
  to: number,
  interval: "minute" | "hour" | "day" | "week" | "month",
) => {
  const map = new Map(
    rows.map((r) => {
      let key = r.t;

      if (interval === "minute") {
        key = format(new Date(r.t), "yyyy-MM-dd HH:mm:00");
      } else if (interval === "hour") {
        key = format(new Date(r.t), "yyyy-MM-dd HH:00:00");
      } else {
        key = format(new Date(r.t), "yyyy-MM-dd 00:00:00");
      }

      return [key, Number(r.value)];
    }),
  );

  const labels: string[] = [];
  const plot: number[] = [];

  // convert unix → UTC date
  let cursor = fromUnixTime(from);
  const end = fromUnixTime(to);

  // ensure UTC (important)
  cursor = toZonedTime(cursor, "UTC");
  const endUtc = toZonedTime(end, "UTC");

  while (cursor <= endUtc) {
    let label = "";

    if (interval === "minute") {
      label = format(cursor, "yyyy-MM-dd HH:mm:00");
      cursor = addMinutes(cursor, 1);
    } else if (interval === "hour") {
      label = format(cursor, "yyyy-MM-dd HH:00:00");
      cursor = addHours(cursor, 1);
    } else {
      label = format(cursor, "yyyy-MM-dd 00:00:00");
      cursor = addDays(cursor, 1);
    }

    labels.push(label);
    plot.push(map.get(label) || 0);
  }

  return { labels, plot };
};
