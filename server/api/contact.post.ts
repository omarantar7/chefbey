import { Resend } from "resend";
import { contactMailTemplate } from "../utils/mailTemplate";
import env from "~~/lib/env";
import { RECAPTCHA_ACTIONS } from "../utils/recaptcha";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { firstName, lastName, email, phoneNumber, message, recaptchaToken } =
    body;

  await verifyRecaptcha(recaptchaToken, RECAPTCHA_ACTIONS.CONTACT_FORM, { minScore: 0.4 });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "contact@chefbey.org",
    to: env.RECIEVED_Email!,
    replyTo: email,
    subject: `New contact from ${firstName} ${lastName}`,
    html: contactMailTemplate({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    }),
  });

  return { success: true };
});
