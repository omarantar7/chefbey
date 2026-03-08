import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import env from "../../lib/env";

const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case", schema });

export default db;