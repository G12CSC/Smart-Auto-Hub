import { transporter } from "./zohoTransporter";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

type SendNewsletterEmailParams = {
  email: string;
  subject: string;
  content: string;
};

export async function sendNewsletterEmail({
  email,
  subject,
  content,
}: SendNewsletterEmailParams) {
  const session = await getServerSession(authOptions);

  await transporter.sendMail({
    from: `"Smart Auto Hub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">Smart Auto Hub</h2>
      <p style="margin: 5px 0 0;">${subject}</p>
    </div>

    <div style="padding: 30px;">
      
      <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 18px;">
        ${content}
      </pre>

    <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px;">
      © ${new Date().getFullYear()} Smart Auto Hub
    </div>

  </div>
</div>
    `,
  });
}
