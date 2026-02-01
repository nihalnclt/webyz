import { FastifyRequest } from "fastify";

import { TrackingPayload } from "../../types/tracking.js";
import { processEvent } from "./processEvent.js";
import { updateSession } from "./session.js";
import { isBot } from "../../utils/bot-detection.js";
import {
  extractClientInfo,
  extractSessionClientInfo,
} from "../../utils/client-info.js";
import { insertEvent } from "../../db/clickhouse.js";

export const track = async (
  payload: TrackingPayload,
  request: FastifyRequest,
) => {
  try {
    // Extract client information
    const clientInfo = extractClientInfo(request);

    // Bot detection
    if (isBot(clientInfo.userAgent)) {
      return { success: false, error: "Bot detected" };
    }

    // IP blocking
    // if (blocke)

    // Process the event
    const processedEvent = await processEvent(payload, clientInfo, request);

    // Store the event
    await insertEvent(request.server.clickhouse, processedEvent);

    // Update session if it's pageview
    if (payload.t === "pageview") {
      const uaInfo = extractSessionClientInfo(clientInfo.userAgent);
      await updateSession(
        request.server.clickhouse,
        processedEvent,
        payload,
        uaInfo,
      );
    }

    return { success: true, eventId: processedEvent.eventId };
  } catch (error) {
    console.log(error);
    request.log.error(error, "track failed");
    return { success: false, error: "internal_error" };
  }
};
