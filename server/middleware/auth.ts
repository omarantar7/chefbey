import db from "~~/lib/db";
import { session } from "~~/lib/db/schema";
import { eq, gt, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const path = event.path;

  if (
    method === "GET" ||
    !path.startsWith("/api") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/contact")
  )
    return;

  const token = getCookie(event, "session_token");

  if (!token) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const [foundSession] = await db
    .select()
    .from(session)
    .where(and(eq(session.token, token), gt(session.expiresAt, new Date())))
    .limit(1);

  if (!foundSession) {
    deleteCookie(event, "session_token");
    throw createError({ statusCode: 401, message: "Session expired" });
  }
});
