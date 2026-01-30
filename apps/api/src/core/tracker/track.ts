import { FastifyRequest } from "fastify";

import { TrackingPayload } from "../../types/tracking.js";
import { processEvent } from "./processEvent.js";
import { updateSession } from "./session.js";
import { isBot } from "../../utils/bot-detection.js";
import { extractClientInfo } from "../../utils/client-info.js";

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

    // Update session if it's pageview
    if (payload.t === "pageview") {
      await updateSession(request.server.clickhouse, processedEvent, payload);
    }

    return { success: true, eventId: processedEvent.eventId };
  } catch (error) {
    console.log(error)
    request.log.error(error, "track failed");
    return { success: false, error: "internal_error" };
  }
};
