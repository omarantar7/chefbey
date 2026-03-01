import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { content } from "./content";

export const contentLocal = sqliteTable("ContentLocal", {
  id: int().primaryKey({ autoIncrement: true }),
  contentId: int("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }), // foreign key
  language: text().notNull(),
  title: text().notNull(),
  attrs: text("attrs", { mode: "json" }).$type<Record<string, any> | null>(),
  createdAt: int()
    .notNull()
    .$default(() => Date.now()),
  updatedAt: int()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now()),
});
