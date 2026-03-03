import { drizzle } from "drizzle-orm/libsql";
import { content, contentLocal } from "~~/lib/db/schema";
import { eq, and } from "drizzle-orm";
import env from "~~/lib/env";
import { seo } from "~~/lib/db/schema/seo";

const db = drizzle(env.TURSO_DATABASE_URL, { casing: "snake_case" });
const CONTENT_TYPE = "contents:recipes";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  // GET
  if (event.method === "GET") {
    if (!id || id === "new") return { settings: null, local: {} };

    const [contentRow] = await db
      .select()
      .from(content)
      .where(eq(content.id, Number(id)))
      .limit(1);

    if (!contentRow)
      throw createError({ statusCode: 404, message: "Not found" });

    const locales = await db
      .select()
      .from(contentLocal)
      .where(eq(contentLocal.contentId, contentRow.id));

    return {
      id: contentRow.id,
      name: contentRow.name,
      settings: contentRow.attrs,
      local: Object.fromEntries(
        locales.map((l) => [l.language, { ...l.attrs, name: l.title }]),
      ),
    };
  }

  // POST (new)
  if (event.method === "POST") {
    const body = await readBody<{
      name: string;
      languages: string[];
      settings: Record<string, any>;
      local: Record<string, Record<string, any>>;
    }>(event);

    if (!body.name)
      throw createError({ statusCode: 400, message: "Name is required" });

    const [inserted] = await db
      .insert(content)
      .values({
        name: body.name,
        type: CONTENT_TYPE,
        attrs: body.settings ?? null,
      })
      .returning();

    for (const lang of body.languages) {
      const [insertedLocale] = await db
        .insert(contentLocal)
        .values({
          contentId: inserted.id,
          language: lang,
          title: body.local?.[lang]?.name ?? body.name,
          attrs: body.local?.[lang] ?? null,
        })
        .returning();

      await db.insert(seo).values({
        contentLocalId: insertedLocale.id,
        title: body.name,
        description: null,
        keywords: null,
        ogTitle: body.name,
        ogDescription: null,
        ogImage: null,
        twitterTitle: body.name,
        twitterDescription: null,
        twitterImage: null,
        canonicalUrl: null,
        robots: "index, follow",
      });
    }

    return { success: true, id: inserted.id };
  }

  // PUT (update)
  if (event.method === "PUT") {
    if (!id) throw createError({ statusCode: 400, message: "ID is required" });

    const body = await readBody<{
      type: "settings" | "local";
      language?: string;
      name?: string;
      attrs: Record<string, any>;
    }>(event);

    const [contentRow] = await db
      .select()
      .from(content)
      .where(eq(content.id, Number(id)))
      .limit(1);

    if (!contentRow)
      throw createError({ statusCode: 404, message: "Not found" });

    if (body.type === "settings") {
      await db
        .update(content)
        .set({
          attrs: body.attrs,
          ...(body.name ? { name: body.name } : {}),
        })
        .where(eq(content.id, contentRow.id));
    }

    if (body.type === "local" && body.language) {
      const [locale] = await db
        .select()
        .from(contentLocal)
        .where(
          and(
            eq(contentLocal.contentId, contentRow.id),
            eq(contentLocal.language, body.language),
          ),
        )
        .limit(1);

      if (!locale)
        throw createError({
          statusCode: 404,
          message: `Locale "${body.language}" not found`,
        });

      await db
        .update(contentLocal)
        .set({
          attrs: body.attrs,
          ...(body.name ? { title: body.name } : {}),
        })
        .where(eq(contentLocal.id, locale.id));
    }

    return { success: true };
  }

  // DELETE
  if (event.method === "DELETE") {
    if (!id) throw createError({ statusCode: 400, message: "ID is required" });

    await db.delete(content).where(eq(content.id, Number(id)));

    return { success: true };
  }

  throw createError({ status: 405, message: "Method not allowed" });
});
