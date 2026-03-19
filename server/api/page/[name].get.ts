import db from "~~/lib/db";
import { content, contentLocal, seo } from "~~/lib/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name")!;
  const lang = (getQuery(event).lang as string) ?? "en";

  // Get content row by type
  const [contentRow] = await db
    .select()
    .from(content)
    .where(eq(content.type, `content:${name}`))
    .limit(1);

  if (!contentRow) {
    throw createError({ statusCode: 404, message: `Content "${name}" not found` });
  }

  // Get contentLocal row by language
  const [localRow] = await db
    .select()
    .from(contentLocal)
    .where(
      and(
        eq(contentLocal.contentId, contentRow.id),
        eq(contentLocal.language, lang),
      ),
    )
    .limit(1);

  // Get seo row
  const [seoRow] = localRow
    ? await db
        .select()
        .from(seo)
        .where(eq(seo.contentLocalId, localRow.id))
        .limit(1)
    : [null];

  return {
    settings: contentRow.attrs ?? {},
    local: localRow?.attrs ?? {},
    seo: seoRow ?? {},
  };
});