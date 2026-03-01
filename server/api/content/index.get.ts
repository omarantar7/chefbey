import { drizzle } from "drizzle-orm/libsql";
import { content } from "~~/lib/db/schema";
import env from "~~/lib/env";
import { notLike } from "drizzle-orm";

const db = drizzle(env?.TURSO_DATABASE_URL, { casing: "snake_case" });

export default defineEventHandler(async () => {
  const contentRows = await db
    .select({
      id: content.id,
      name: content.name,
      type: content.type,
      createdAt: content.createdAt,
    })
    .from(content)
    .where(notLike(content.type, "contents%"));

  return contentRows;
});
