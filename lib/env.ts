import { z } from "zod";

const envSchema = z.object({
  BUN_ENV: z.string(),
  ETHEREAL_USER: z.string(),
  ETHEREAL_PASS: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  BASE_URL: z.string(),
  // GMAIL_USER  : z.string(),
  // GMAIL_APP_PASS: z.string(),
  RESEND_API_KEY: z.string(),
  RECIEVED_Email: z.string(),
  NUXT_DB_FILE_NAME: z.string().default("local.db"),
  CONTENT_LANGUAGES: z
    .string()
    .default("en")
    .transform((val) => val.split(",").map((l) => l.trim())),
});

export type envSchema = z.infer<typeof envSchema>;

export default envSchema.parse(process.env);
