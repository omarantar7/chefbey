import db from "~~/lib/db";
import { content, contentLocal } from "~~/lib/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, "type")!;
  const lang = (getQuery(event).lang as string) ?? "en";

  const rows = await db
    .select()
    .from(content)
    .where(eq(content.type, `contents:${type}`));

  const result = await Promise.all(
    rows.map(async (row) => {
      const [localRow] = await db
        .select()
        .from(contentLocal)
        .where(
          and(
            eq(contentLocal.contentId, row.id),
            eq(contentLocal.language, lang),
          ),
        )
        .limit(1);

      return {
        id: row.id,
        name: localRow?.title ?? row.name,
        settings: row.attrs ?? {},
        local: localRow?.attrs ?? {},
      };
    }),
  );

  return result;
});
