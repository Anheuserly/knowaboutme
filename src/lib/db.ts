import { Client, QueryResult, QueryResultRow } from "pg";

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:AnheVps2022@vps.amcmep.in:5432/knowaboutme";

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
    ssl: false,
  });

  client.on("error", (err) => {
    if (process.env.NODE_ENV === "development") {
      console.warn("[DB Client Notice]", err?.message || err);
    }
  });

  await client.connect();
  const start = Date.now();
  try {
    const res = await client.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("[DB QUERY]", { text: text.slice(0, 100), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error("[DB ERROR]", { text: text.slice(0, 150), error });
    throw error;
  } finally {
    try {
      await client.end();
    } catch {
      // Ignore disconnect errors
    }
  }
}

export async function getClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:AnheVps2022@vps.amcmep.in:5432/knowaboutme";

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
    ssl: false,
  });
  await client.connect();
  return client;
}

export default query;
