import { compare } from "bcrypt";
import db from "~~/lib/db";
import { session } from "~~/lib/db/schema";
import { randomBytes } from "crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  try {
    // Find user
    const foundUser = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!foundUser) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isValidPassword = await compare(password, foundUser.password);

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    // Generate session ID and token
    const sessionId = randomBytes(16).toString("hex"); // Generate unique session ID
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create session
    const [newSession] = await db
      .insert(session)
      .values({
        id: sessionId, // Add the id field
        userId: foundUser.id,
        token,
        expiresAt,
        ipAddress: getRequestIP(event),
        userAgent: getRequestHeader(event, "user-agent"),
      })
      .returning();

    // Set cookie
    setCookie(event, "session_token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        emailVerified: foundUser.emailVerified,
      },
      session: {
        id: newSession.id,
        expiresAt: newSession.expiresAt,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Login failed. Please try again.",
    });
  }
});
