import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __planoryPgPool: Pool | undefined;
}

function getPool(): Pool {
  if (globalThis.__planoryPgPool) return globalThis.__planoryPgPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  globalThis.__planoryPgPool = new Pool({
    connectionString,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? undefined
        : {
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          },
    max: 5,
  });

  return globalThis.__planoryPgPool;
}

export const db = {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return getPool().query<T>(text, params);
  },
};

export function getAnalyticsEnvironment(): string {
  return process.env.ANALYTICS_ENVIRONMENT ?? process.env.NODE_ENV ?? "development";
}
