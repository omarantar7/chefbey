import db from "~~/lib/db";
import { content } from "~~/lib/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async () => {
  const languages = (process.env.CONTENT_LANGUAGES ?? "en")
    .split(",")
    .map((l) => l.trim());

  const staticUrls = languages.flatMap((lang) => [{ loc: `/${lang}` }]);

  try {
    const rows = await db
      .select()
      .from(content)
      .where(eq(content.type, "contents:recipes"));

    const recipeUrls = languages.flatMap((lang) =>
      rows.map((row) => ({
        loc: `/${lang}/recipes/${row.id}`,
        lastmod: new Date().toISOString(),
      })),
    );

    return [...staticUrls, ...recipeUrls];
  } catch (e) {
    console.error("Sitemap DB error:", e);
    return staticUrls;
  }
});
