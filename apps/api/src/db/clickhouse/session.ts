import { ClickHouseClient } from "@clickhouse/client";

import { toClickHouseDateTime64 } from "../../utils/time.js";
import { SessionRow } from "./types.js";
import { SessionData } from "../../core/tracker/tracker.types.js";

export const getSession = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  sessionId: string,
): Promise<SessionRow | null> => {
  const result = await clickhouse.query({
    query: `
      SELECT 
        session_id,
        website_id,
        user_id,
        toUnixTimestamp(start_time) as start_time,
        toUnixTimestamp(end_time) as end_time,
        duration_seconds,
        entry_page,
        exit_page,
        page_views,
        events,
        hostname,
        browser_family,
        browser_version,
        os_family,
        os_version,
        device_type,
        device_brand,
        country,
        city
      FROM sessions
      WHERE website_id = {websiteId:String}
        AND session_id = {sessionId:String}
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
  session: SessionData,
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
        browser_family: session.browserFamily,
        browser_version: session.browserVersion,
        os_family: session.osFamily,
        os_version: session.osVersion,
        device_type: session.deviceType,
        device_brand: session.deviceBrand,
        country: session.country,
        city: session.city,
        updated_at: toClickHouseDateTime64(new Date()),
      },
    ],
    format: "JSONEachRow",
  });
};
