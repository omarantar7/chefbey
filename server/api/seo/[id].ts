import { drizzle } from "drizzle-orm/libsql";
import { seo } from "~~/lib/db/schema";
import { eq } from "drizzle-orm";
import env from "~~/lib/env";

const db = drizzle(env.TURSO_DATABASE_URL, { casing: "snake_case" });

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) throw createError({ statusCode: 400, message: "Invalid ID" });

  if (event.method === "GET") {
    const [row] = await db.select().from(seo).where(eq(seo.id, id)).limit(1);

    if (!row)
      throw createError({ statusCode: 404, message: "SEO entry not found" });

    return row;
  }

  if (event.method === "PUT") {
    const body = await readBody<{
      title?: string;
      description?: string;
      keywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
      twitterTitle?: string;
      twitterDescription?: string;
      twitterImage?: string;
      canonicalUrl?: string;
      robots?: string;
    }>(event);

    await db
      .update(seo)
      .set({
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        ogTitle: body.ogTitle,
        ogDescription: body.ogDescription,
        ogImage: body.ogImage,
        twitterTitle: body.twitterTitle,
        twitterDescription: body.twitterDescription,
        twitterImage: body.twitterImage,
        canonicalUrl: body.canonicalUrl,
        robots: body.robots,
      })
      .where(eq(seo.id, id));

    return { success: true };
  }

  throw createError({ status: 405, message: "Method not allowed" });
});
