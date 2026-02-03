import { ClickHouseClient } from "@clickhouse/client";

import { toUnixSeconds } from "../../utils/time.js";
import { EventData, SessionData, SessionUAInfo } from "./types.js";
import { getSession, upsertSession } from "../../db/clickhouse/session.js";

export const updateSession = async (
  clickhouse: ClickHouseClient,
  event: EventData,
  isNewSession: boolean,
  uaInfo: SessionUAInfo,
) => {
  const existingSession = await getSession(
    clickhouse,
    event.websiteId,
    event.sessionId,
  );

  // Convert event.timestamp to Unix seconds
  const eventTimestamp = toUnixSeconds(event.timestamp);

  if (existingSession && !isNewSession) {
    const sessionData: SessionData = {
      sessionId: existingSession.session_id,
      websiteId: existingSession.website_id,
      userId: existingSession.user_id,
      startTime: existingSession.start_time,
      endTime: eventTimestamp,
      durationSeconds: eventTimestamp - existingSession.start_time,
      entryPage: existingSession.entry_page,
      exitPage: event.urlPath,
      pageViews: existingSession.page_views + 1,
      events: existingSession.events + 1,
      hostname: existingSession.hostname,
      browserFamily: existingSession.browser_family,
      browserVersion: existingSession.browser_version,
      osFamily: existingSession.os_family,
      osVersion: existingSession.os_version,
      deviceType: existingSession.device_type,
      deviceBrand: existingSession.device_brand,
      country: existingSession.country,
      city: existingSession.city,
    };

    await upsertSession(clickhouse, sessionData);
  } else {
    const sessionData: SessionData = {
      sessionId: event.sessionId,
      websiteId: event.websiteId,
      userId: event.userId,
      startTime: eventTimestamp,
      endTime: eventTimestamp,
      durationSeconds: 0,
      entryPage: event.urlPath,
      exitPage: event.urlPath,
      pageViews: 1,
      events: 1,
      hostname: event.hostname,
      country: event.country,
      city: event.city,

      browserFamily: uaInfo.browserFamily,
      browserVersion: uaInfo.browserVersion,
      osFamily: uaInfo.osFamily,
      osVersion: uaInfo.osVersion,
      deviceType: uaInfo.deviceType,
      deviceBrand: uaInfo.deviceBrand,
    };

    await upsertSession(clickhouse, sessionData);
  }
};
