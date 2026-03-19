import db from "~~/lib/db";

export default defineEventHandler(async (event) => {
  try {
    // Get session token from cookie
    const token = getCookie(event, "session_token");

    if (!token) {
      throw createError({
        statusCode: 401,
        message: "No session token found",
      });
    }

    // Find valid session with user
    const foundSession = await db.query.session.findFirst({
      where: (sessions, { eq, and, gt }) =>
        and(
          eq(sessions.token, token),
          gt(sessions.expiresAt, new Date())
        ),
      with: {
        user: true,
      },
    });

    if (!foundSession) {
      // Session expired or invalid, clear cookie
      deleteCookie(event, "session_token");
      throw createError({
        statusCode: 401,
        message: "Session expired or invalid",
      });
    }

    // Return user and session data
    return {
      success: true,
      user: {
        id: foundSession.user.id,
        email: foundSession.user.email,
        name: foundSession.user.name,
        emailVerified: foundSession.user.emailVerified,
        image: foundSession.user.image,
      },
      session: {
        id: foundSession.id,
        expiresAt: foundSession.expiresAt,
        token: foundSession.token,
      },
    };
  } catch (error: any) {
    console.error("Auto-login error:", error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 401,
      message: "Auto-login failed",
    });
  }
});