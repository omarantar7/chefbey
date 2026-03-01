import { drizzle } from "drizzle-orm/libsql";
import { content } from "~~/lib/db/schema";
import env from "~~/lib/env";
import { like } from "drizzle-orm";

const db = drizzle(env?.TURSO_DATABASE_URL, { casing: "snake_case" });

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, "type")!;

  if (event.method === "GET") {
    const contentsRows = await db
      .select({
        id: content.id,
        name: content.name,
        type: content.type,
        createdAt: content.createdAt,
      })
      .from(content)
      .where(like(content.type, `contents:${type}`));
    return contentsRows;
  }

  throw createError({ status: 405, message: "Method not allowed" });
});
