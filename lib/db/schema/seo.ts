import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { contentLocal } from "./contentLocal";

export const seo = sqliteTable("seo", {
  id: int().primaryKey({ autoIncrement: true }),
  contentLocalId: int("content_local_id")
    .notNull()
    .references(() => contentLocal.id, { onDelete: "cascade" }),
  title: text(),
  description: text(),
  keywords: text(),
  ogTitle: text(),
  ogDescription: text(),
  ogImage: text(),
  twitterTitle: text(),
  twitterDescription: text(),
  twitterImage: text(),
  canonicalUrl: text(),
  robots: text().default("index, follow"),
  createdAt: int()
    .notNull()
    .$default(() => Date.now()),
  updatedAt: int()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now()),
});
