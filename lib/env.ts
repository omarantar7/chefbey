//env.ts
import { z } from "zod";

const envSchema = z.object({
  BUN_ENV: z.string(),
  ETHEREAL_USER: z.string(),
  ETHEREAL_PASS: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
});

export type envSchema = z.infer<typeof envSchema>;

export default envSchema.parse(process.env);
