import env from "~~/lib/env";

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

interface VerifyRecaptchaOptions {
  minScore?: number; // defaults to 0.5
}

export const RECAPTCHA_ACTIONS = {
  ADMIN_LOGIN: "admin_login",
  CONTACT_FORM: "contact_form",
} as const;

export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction: string,
  options: VerifyRecaptchaOptions = {},
): Promise<void> {
  const { minScore = 0.5 } = options;

  if (!token) {
    throw createError({
      statusCode: 400,
      message: "reCAPTCHA token is missing",
    });
  }

  let verifyRes: RecaptchaVerifyResponse;
  try {
    verifyRes = await $fetch<RecaptchaVerifyResponse>(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: env.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      },
    );
  } catch (err) {
    console.error("reCAPTCHA verification request failed:", err);
    throw createError({
      statusCode: 502,
      message: "Could not verify reCAPTCHA. Please try again.",
    });
  }

  if (!verifyRes.success) {
    throw createError({
      statusCode: 403,
      message: "reCAPTCHA verification failed",
    });
  }

  if (verifyRes.action && verifyRes.action !== expectedAction) {
    throw createError({
      statusCode: 403,
      message: "reCAPTCHA action mismatch",
    });
  }

  const score = verifyRes.score ?? 0;
  if (score < minScore) {
    throw createError({
      statusCode: 403,
      message: "reCAPTCHA score too low",
    });
  }
}
