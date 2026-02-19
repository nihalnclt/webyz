import { ClickHouseClient } from "@clickhouse/client";

export const createWebsiteQuery = async (
  clickhouse: ClickHouseClient,
  id: string,
  domain: string,
  timezone: string,
) => {
  await clickhouse.insert({
    table: "webyz_analytics.websites",
    values: [
      {
        id,
        domain,
        timezone,
        created_at: new Date(),
      },
    ],
    format: "JSONEachRow",
  });
};
