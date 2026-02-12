import { topStatsQuery } from "../../db/clickhouse/top-stats.js";
import { AppContext } from "../context.js";
import { TopStatsInput } from "./types.js";

export const getTopStats = async (
  { clickhouse }: AppContext,
  input: TopStatsInput,
) => {
  const row = await topStatsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
    input.compareFrom,
    input.compareTo,
  );

  if (!row) return null;

  const currVisitors = Number(row.visitors || 0);
  const prevVisitors = Number(row.prev_visitors || 0);

  const currVisits = Number(row.visits || 0);
  const prevVisits = Number(row.prev_visits || 0);

  const currPageviews = Number(row.pageviews || 0);
  const prevPageviews = Number(row.prev_pageviews || 0);

  const currDuration = Number(row.visit_duration || 0);
  const prevDuration = Number(row.prev_visit_duration || 0);

  const currBounces = Number(row.bounces || 0);
  const prevBounces = Number(row.prev_bounces || 0);

  const calcChange = (curr: number, prev: number) => {
    if (prev === 0 && curr === 0) return 0;
    if (prev === 0) return 100;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const viewsPerVisit = currVisits ? currPageviews / currVisits : 0;
  const prevViewsPerVisit = prevVisits ? prevPageviews / prevVisits : 0;

  const bounceRate = currVisits ? (currBounces / currVisits) * 100 : 0;
  const prevBounceRate = prevVisits ? (prevBounces / prevVisits) * 100 : 0;

  return [
    {
      name: "Unique visitors",
      value: currVisitors,
      comparison_value: prevVisitors,
      change: calcChange(currVisitors, prevVisitors),
      graph_metric: "visitors",
    },
    {
      name: "Total visits",
      value: currVisits,
      comparison_value: prevVisits,
      change: calcChange(currVisits, prevVisits),
      graph_metric: "visits",
    },
    {
      name: "Total pageviews",
      value: currPageviews,
      comparison_value: prevPageviews,
      change: calcChange(currPageviews, prevPageviews),
      graph_metric: "pageviews",
    },
    {
      name: "Views per visit",
      value: Number(viewsPerVisit.toFixed(2)),
      comparison_value: Number(prevViewsPerVisit.toFixed(2)),
      change: calcChange(viewsPerVisit, prevViewsPerVisit),
      graph_metric: "views_per_visit",
    },
    {
      name: "Bounce rate",
      value: Math.round(bounceRate),
      comparison_value: Math.round(prevBounceRate),
      change: calcChange(bounceRate, prevBounceRate),
      graph_metric: "bounce_rate",
    },
    {
      name: "Visit duration",
      value: Math.round(currDuration),
      comparison_value: Math.round(prevDuration),
      change: calcChange(currDuration, prevDuration),
      graph_metric: "visit_duration",
    },
  ];
};
