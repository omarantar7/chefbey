import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const content = sqliteTable("content", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text().notNull(),
  attrs: text("attrs", { mode: "json" }).$type<Record<string, any> | null>(),
  createdAt: int()
    .notNull()
    .$default(() => Date.now()),
  position: int().default(0),
  updatedAt: int()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now()),
});
