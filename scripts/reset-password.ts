import { user } from "../lib/db/schema/auth";
import env from "../lib/env";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";

const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case" });

async function changePassword(email: string, newPassword: string) {
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existingUser.length === 0) {
    console.error(`❌ No user found with email: ${email}`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(user)
    .set({ password: hashedPassword })
    .where(eq(user.email, email));

  console.log(`✅ Password for ${email} updated successfully`);
}

const [, , email, newPassword] = process.argv;

if (!email || !newPassword) {
  console.error(
    "Usage: ts-node scripts/changePassword.ts <email> <newPassword>",
  );
  process.exit(1);
}

changePassword(email, newPassword);
