import { getSession, upsertSession } from "../../db/clickhouse.js";
import { TrackingPayload } from "../../types/tracking.js";

export const updateSession = async (
  clickhouse: any,
  event: any,
  payload: TrackingPayload,
) => {
  const existingSession = await getSession(
    clickhouse,
    event.websiteId,
    event.sessionId,
  );

  const isNewSession = payload.new_session === 1 || payload.new_session === "1";

  if (existingSession && !isNewSession) {
    const sessionData = {
      ...existingSession,
      endTime: event.timestamp,
      durationSeconds: Math.floor(
        (event.timestamp.getTime() - existingSession.start_time.getTime()) /
          1000,
      ),
      exitPage: event.urlPath,
      pageViews: existingSession.page_views + 1,
      events: existingSession.events + 1,
    };

    await upsertSession(clickhouse, sessionData);
  } else {
    const sessionData = {
      sessionId: event.sessionId,
      websiteId: event.websiteId,
      userId: event.userId,
      startTime: event.timestamp,
      endTime: event.timestamp,
      duarationSeconds: 0,
      entryPage: event.urlPath,
      exitPage: event.urlPath,
      pageViews: 1,
      events: 1,
      hostname: event.hostname,
      browser: event.browser,
      os: event.os,
      device: event.device,
      country: event.country,
      city: event.city,
    };

    await upsertSession(clickhouse, sessionData);
  }
};
