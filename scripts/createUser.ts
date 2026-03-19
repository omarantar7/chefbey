import { user } from "../lib/db/schema/auth";
import env from "../lib/env";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/libsql";
const db = drizzle(env.NUXT_DB_FILE_NAME, { casing: "snake_case" });

async function addUser(
  name: string,
  email: string,
  password: string,
  image?: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(user).values({
    id: randomUUID(),
    name,
    email,
    password: hashedPassword,
    emailVerified: true,
    image,
  });

  console.log(`✅ User ${email} added successfully`);
}

const [, , name, email, password, image] = process.argv;

if (!name || !email || !password) {
  console.error(
    "Usage: ts-node scripts/addUser.ts <name> <email> <password> [image]",
  );
  process.exit(1);
}

addUser(name, email, password, image);
