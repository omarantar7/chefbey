import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import env from "./lib/env";

export default defineConfig({
  out: "./lib/db/migration",
  schema: "./lib/db/schema/index.ts",
  casing: "snake_case",
  dialect: "sqlite",
  dbCredentials: {
    url: env.NUXT_DB_FILE_NAME!,
  },
});
