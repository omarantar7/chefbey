//testdb.get.ts
import { drizzle } from "drizzle-orm/libsql";
import { user } from "../../lib/db/schema/auth";
import env from "../../lib/env";

export default eventHandler(async (event) => {
  const db = drizzle(env.TURSO_DATABASE_URL);

  const users = await db.select().from(user);
  return { users };
});
