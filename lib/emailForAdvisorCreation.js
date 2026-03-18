import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route.ts";

dotenv.config();

const user = process.env.EMAIL_USER.trim();
const pass = process.env.EMAIL_PASS.trim();

console.log("USER:", user);
console.log("PASS LENGTH:", pass.length);
console.log("PASS VALUE:", JSON.stringify(pass));

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com", // try this instead
    port: 465,
    secure: true,
    auth: {
        user,
        pass,
    },
    debug: true,
    logger: true,
});

transporter.verify()

    .then(() => console.log("SMTP READY"))
    .catch(err => console.error("ERROR:", err));

export async function sendAdvisorTempID(email, tempPassword,name) {

    const session = await getServerSession(authOptions);

    await transporter.sendMail({

        from: `"Smart Auto Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Advisor Account",
        html: `
 
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">Smart Auto Hub</h2>
      <p style="margin: 5px 0 0;">Advisor Account Created</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <h3 style="margin-top: 0;">Welcome 👋 ${name}</h3>
      <p>Your advisor account has been successfully created.</p>

      <p><strong>Temporary Password:</strong></p>
      <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 18px; text-align: center; letter-spacing: 2px;">
        ${tempPassword}
      </div>

      <p style="margin-top: 20px;">
        Please log in using this password and change it immediately for security.
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://smartautohub.live/admin/login"
           style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
           Login Now
        </a>
      </div>

      <p style="font-size: 12px; color: #6b7280;">
        If you did not request this account, please ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
      © ${new Date().getFullYear()} Smart Auto Hub. All rights reserved.
    </div>

  </div>
</div>
\`
    `,
    });

    await transporter.verify()
        .then(() => console.log("SMTP READY"))
        .catch(err => console.error("SMTP ERROR:", err));
}



