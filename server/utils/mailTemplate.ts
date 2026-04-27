export const contactMailTemplate = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 20px; background-color: #f1f5f9;">

  <div style="font-family: 'Open Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background-color: #0e7490; padding: 32px; text-align: center;">
      <img 
        src="https://chefbey.org/logo2.webp" 
        alt="ChefBey Logo" 
        style="height: 80px; object-fit: contain;"
      />
    </div>

    <!-- Title -->
    <div style="background-color: #0e7490; padding: 0 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
        New Contact Message
      </h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">
        You have received a new message from your website
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">

      <!-- Sender Info -->
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #0e7490;">
        <h2 style="margin: 0 0 16px; font-size: 16px; color: #0e7490; font-weight: 600;">
          Sender Information
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Full Name</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; font-size: 14px;">
              <a href="mailto:${email}" style="color: #0e7490; text-decoration: none; font-weight: 500;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${phoneNumber}</td>
          </tr>
        </table>
      </div>

      <!-- Message -->
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border-left: 4px solid #0e7490;">
        <h2 style="margin: 0 0 12px; font-size: 16px; color: #0e7490; font-weight: 600;">
          Message
        </h2>
        <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
      </div>

      <!-- Reply Button -->
      <div style="text-align: center; margin-top: 28px;">
        <a 
          href="mailto:${email}" 
          style="display: inline-block; background-color: #0e7490; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 15px; font-weight: 600;"
        >
          Reply to ${firstName}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
        This email was sent from the contact form on 
        <a href="https://chefbey.org" style="color: #0e7490; text-decoration: none;">chefbey.org</a>
      </p>
    </div>

  </div>

</body>
</html>
`;