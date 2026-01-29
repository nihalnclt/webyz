import { ClickHouseClient } from "@clickhouse/client";

export type SessionRow = {
  session_id: string;
  website_id: string;
  user_id: string;
  start_time: Date;
  end_time: Date;
  duration_seconds: number;
  entry_page: string;
  exit_page: string;
  page_views: number;
  events: number;
  hostname: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  city: string;
};

export const getSession = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  sessionId: string,
): Promise<SessionRow | null> => {
  const result = await clickhouse.query({
    query: `
      SELECT *
      FROM webyz_analytics.sessions
      WHERE website_id = {websiteId:UUID}
        AND session_id = {sessionId:UUID}
      ORDER BY end_time DESC
      LIMIT 1
    `,
    query_params: {
      websiteId,
      sessionId,
    },
  });

  const { data } = await result.json<SessionRow>();

  return data.length ? data[0] : null;
};

export const upsertSession = async (
  clickhouse: ClickHouseClient,
  session: any,
) => {
  await clickhouse.insert({
    table: "sessions",
    values: [
      {
        session_id: session.sessionId,
        website_id: session.websiteId,
        user_id: session.userId,
        start_time: session.startTime,
        end_time: session.endTime,
        duration_seconds: session.durationSeconds,
        entry_page: session.entryPage,
        exit_page: session.exitPage,
        page_views: session.pageViews,
        events: session.events,
        hostname: session.hostname,
        browser: session.browser,
        os: session.os,
        device: session.device,
        country: session.country,
        city: session.city,
      },
    ],
    format: "JSONEachRow",
  });
};
