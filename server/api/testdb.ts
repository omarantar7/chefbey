//testdb.get.ts
import { user } from "../../lib/db/schema/auth";
import env from "../../lib/env";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case" });

export default eventHandler(async (event) => {
  const users = await db.select().from(user);
  return { users };
});
