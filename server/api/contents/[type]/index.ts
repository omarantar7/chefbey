import { content } from "~~/lib/db/schema";
import { like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import env from "~~/lib/env";

const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case" });

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
