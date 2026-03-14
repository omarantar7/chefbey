import { seo, contentLocal } from "~~/lib/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import env from "~~/lib/env";

const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case" });
export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const rows = await db
      .select({
        id: seo.id,
        title: seo.title,
        language: contentLocal.language,
        robots: seo.robots,
        createdAt: seo.createdAt,
        contentLocalId: seo.contentLocalId,
        contentName: contentLocal.title,
      })
      .from(seo)
      .leftJoin(contentLocal, eq(seo.contentLocalId, contentLocal.id));

    return rows;
  }

  throw createError({ status: 405, message: "Method not allowed" });
});