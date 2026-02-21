import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const content = sqliteTable("content", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text().notNull(),
  attrs: text("attrs", { mode: "json" }).$type<Record<string, any>>().notNull(),
  createdAt: int()
    .notNull()
    .$default(() => Date.now()),
  updatedAt: int()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now()),
});
