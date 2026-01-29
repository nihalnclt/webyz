import {
  CLICKHOUSE_HOST,
  CLICKHOUSE_USER,
  CLICKHOUSE_PASSWORD,
} from "./env.js";

export const clickhouseConfig = {
  host: CLICKHOUSE_HOST,
  username: CLICKHOUSE_USER,
  password: CLICKHOUSE_PASSWORD,
  database: "default",
};
