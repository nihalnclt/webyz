import { createClient } from "@clickhouse/client";
import { readdirSync, readFileSync } from "fs";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

async function runMigrations() {
  console.log("CLICKHOUSE_HOST", process.env.CLICKHOUSE_URL);

  const client = createClient({
    url: process.env.CLICKHOUSE_URL,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: "webyz_analytics",
  });

  const migrationsDir = path.join(
    import.meta.dirname,
    "../clickhouse/migrations"
  );
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));

  for (const file of files) {
    const checkQuery = `
      SELECT 1 FROM migrations WHERE name = '${file}' LIMIT 1
    `;

    let alreadyApplied = false;
    try {
      const resultSet = await client.query({ query: checkQuery });
      const data = await resultSet?.json();
      alreadyApplied = (data?.rows || 0) > 0;
    } catch (err) {}

    if (alreadyApplied) {
      console.log(`Skipping ${file} (already applied)`);
      continue;
    }

    const sql = readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Running migration: ${file}`);
    await client.exec({ query: sql });

    await client.exec({
      query: `INSERT INTO migrations (name, executed_at) VALUES ('${file}', now())`,
    });
    console.log(`✅ Completed ${file}`);
  }

  console.log("Done");
  await client.close();
}

runMigrations().catch(console.error);
