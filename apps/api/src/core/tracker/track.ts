import { updateSession } from "./session.js";
import { EventInput, SessionUAInfo } from "./types.js";
import { ClickHouseClient } from "@clickhouse/client";
import { mapEventInputToEventData } from "./event.js";
import { insertEvent } from "../../db/clickhouse/event.js";

export const track = async (
  deps: { clickhouse: ClickHouseClient },
  input: {
    input: EventInput;
    uaInfo: SessionUAInfo;
    isPageView: boolean;
    newSession: boolean;
  },
) => {
  const event = mapEventInputToEventData(input.input);

  // Store the event
  await insertEvent(deps.clickhouse, event);

  // Update session if it's pageview
  if (input.isPageView) {
    await updateSession(deps.clickhouse, event, input.newSession, input.uaInfo);
  }
};
