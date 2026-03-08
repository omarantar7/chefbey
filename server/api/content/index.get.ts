import { content } from "~~/lib/db/schema";
import { notLike } from "drizzle-orm";

import { drizzle } from "drizzle-orm/libsql";
import env from "~~/lib/env";

const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case" });
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
