import { content, contentLocal } from "~~/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import env from "~~/lib/env";

const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case" });

export const contentService = {
  async get(type: string, contentType: string = "content") {
    const [contentRow] = await db
      .select()
      .from(content)
      .where(eq(content.type, `${contentType}:${type}`))
      .limit(1);

    if (!contentRow) {
      throw createError({ statusCode: 404, message: "Content type not found" });
    }

    const locales = await db
      .select()
      .from(contentLocal)
      .where(eq(contentLocal.contentId, contentRow.id));

    return {
      ...contentRow,
      local: Object.fromEntries(locales.map((l) => [l.language, l.attrs])),
      settings: contentRow.attrs,
    };
  },

  async update(
    type: string,
    body: {
      type: "settings" | "local";
      language?: string;
      attrs: Record<string, any>;
    },
    contentType: string = "content",
  ) {
    const [contentRow] = await db
      .select()
      .from(content)
      .where(eq(content.type, `${contentType}:${type}`))
      .limit(1);

    if (!contentRow) {
      throw createError({ statusCode: 404, message: "Content type not found" });
    }

    if (body.type === "settings") {
      await db
        .update(content)
        .set({ attrs: body.attrs })
        .where(eq(content.id, contentRow.id));
    }

    if (body.type === "local" && body.language) {
      const [existingLocale] = await db
        .select()
        .from(contentLocal)
        .where(
          and(
            eq(contentLocal.contentId, contentRow.id),
            eq(contentLocal.language, body.language),
          ),
        )
        .limit(1);

      if (!existingLocale) {
        throw createError({
          statusCode: 404,
          message: `Locale "${body.language}" not found`,
        });
      }

      await db
        .update(contentLocal)
        .set({ attrs: body.attrs })
        .where(eq(contentLocal.id, existingLocale.id));
    }

    return { success: true };
  },

  async delete(id: number) {
    const [row] = await db
      .select()
      .from(content)
      .where(eq(content.id, id))
      .limit(1);

    if (!row) {
      throw createError({ status: 404, message: "Content type not found" });
    }

    await db.delete(content).where(eq(content.id, id));

    return { success: true };
  },
};
