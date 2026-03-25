import db from "~~/lib/db";
import { content, contentLocal, seo } from "~~/lib/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, "type")!;
  const id = Number(getRouterParam(event, "id"));
  const lang = (getQuery(event).lang as string) ?? "en";

  const [contentRow] = await db
    .select()
    .from(content)
    .where(and(eq(content.id, id), eq(content.type, `contents:${type}`)))
    .limit(1);

  if (!contentRow) {
    throw createError({ statusCode: 404, message: `${type} not found` });
  }

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

  const [seoRow] = localRow
    ? await db
        .select()
        .from(seo)
        .where(eq(seo.contentLocalId, localRow.id))
        .limit(1)
    : [null];

  return {
    id: contentRow.id,
    name: localRow.title ?? contentRow?.name,
    settings: contentRow.attrs ?? {},
    local: localRow?.attrs ?? {},
    seo: seoRow ?? {},
  };
});
