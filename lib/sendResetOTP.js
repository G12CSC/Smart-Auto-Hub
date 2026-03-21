import { transporter } from "./zohoTransporter";

export async function sendResetOTP(email, otp) {

    try {
        await transporter.sendMail({
            from: `"Smart Auto Hub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Password OTP",
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#2563eb;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
        });

        console.log("✅ OTP email sent to:", email);
    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        throw new Error("Failed to send OTP email");
    }
}