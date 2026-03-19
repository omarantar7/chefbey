// server/api/auth/logout.post.ts
import db from "~~/lib/db";
import { session } from "~~/lib/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "session_token");

  if (token) {
    await db.delete(session).where(eq(session.token, token));
    deleteCookie(event, "session_token");
  }

  return { success: true };
});
