import { transporter } from "./zohoTransporter";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export async function sendAdvisorTempID(email, tempPassword, name) {

    const session = await getServerSession(authOptions);

    await transporter.sendMail({
        from: `"Smart Auto Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Advisor Account",
        html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">Smart Auto Hub</h2>
      <p style="margin: 5px 0 0;">Advisor Account Created</p>
    </div>

    <div style="padding: 30px;">
      <h3>Welcome 👋 ${name}</h3>
      <p>Your advisor account has been successfully created.</p>

      <p><strong>Temporary Password:</strong></p>
      <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 18px; text-align: center;">
        ${tempPassword}
      </div>
      
      
<p style="margin-top: 15px; text-align: center;">
  Please log in using this password and change it immediately for security.
</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://smartautohub.live/admin/login"
           style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
           Login Now
        </a>
      </div>
    </div>

    <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px;">
      © ${new Date().getFullYear()} Smart Auto Hub
    </div>

  </div>
</div>
    `,
    });
}