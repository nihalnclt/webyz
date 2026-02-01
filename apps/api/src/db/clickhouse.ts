import { ClickHouseClient } from "@clickhouse/client";

import { toClickHouseDateTime64, toUnixSeconds } from "../utils/time.js";
import { BrowserStatsRow, EventData, SessionData, SessionRow } from "../types/tracking.js";

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

export const insertEvent = async (clickhouse: ClickHouseClient, event: EventData) => {
  await clickhouse.insert({
    table: "events",
    values: [
      {
        event_id: event.eventId,
        website_id: event.websiteId,
        session_id: event.sessionId,
        user_id: event.userId,
        event_type: event.eventType,
        event_name: event.eventName,
        timestamp: toUnixSeconds(event.timestamp),
        url_path: event.urlPath,
        url_query: event.urlQuery,
        referrer_path: event.referrerPath,
        referrer_query: event.referrerQuery,
        referrer_domain: event.referrerDomain,
        page_title: event.pageTitle,
        hostname: event.hostname,
        browser: event.browser,
        os: event.os,
        device_type: event.deviceType,
        screen: event.screen,
        language: event.language,
        country: event.country,
        subdivision1: event.subdivision1,
        subdivision2: event.subdivision2,
        city: event.city,
        utm_source: event.utmSource,
        utm_medium: event.utmMedium,
        utm_campaign: event.utmCampaign,
        utm_content: event.utmContent,
        utm_term: event.utmTerm,
        "meta.key": event.metaKeys,
        "meta.value": event.metaValues,
      },
    ],
    format: "JSONEachRow",
  });
};

export const browserStatsQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  limit: number,
  offset: number,
  detailed: boolean,
) => {
  const selectedFields = detailed
    ? `
      browser_family AS name,
      count() AS visitors,
      avg(duration_seconds) AS visit_duration,
      sum(page_views = 1) / count() * 100 AS bounce_rate
    `
    : `
      browser_family AS name,
      count() AS visitors
    `;

  const query = `
    SELECT ${selectedFields}
    FROM sessions FINAL
    WHERE website_id = {websiteId:String}
      AND start_time <= fromUnixTimestamp({to:UInt32})
      AND end_time >=fromUnixTimestamp({from:UInt32}) 
    GROUP BY browser_family
    ORDER BY visitors DESC
    LIMIT {limit:UInt32} OFFSET {offset:UInt32}
  `;

  const result = await clickhouse.query({
    query,
    query_params: {
      websiteId,
      from,
      to,
      limit,
      offset,
    },
    format: "JSONEachRow",
  });

  return result.json<BrowserStatsRow>();
};

export const browsersTotalsQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
) => {
  const result = await clickhouse.query({
    query: `
      SELECT count() AS total
      FROM sessions FINAL
      WHERE website_id = {websiteId:String}
        AND start_time <= fromUnixTimestamp({to:UInt32})
        AND end_time >=fromUnixTimestamp({from:UInt32}) 
    `,
    query_params: {
      websiteId,
      from,
      to,
    },
  });

  const { data } = await result.json<{ total: string }>();
  return data.length > 0 ? parseInt(data[0].total, 10) : 0;
};
