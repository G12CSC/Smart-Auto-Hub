import { transporter } from "./zohoTransporter";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

type couponCodeParams = {
  email: string;
  couponCode: string;
};

export async function sendCouponCode({
  email,
  couponCode
}: couponCodeParams) {
  const session = await getServerSession(authOptions);

  await transporter.sendMail({
    from: `"Smart Auto Hub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Exclusive Coupon Code",
    html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">Smart Auto Hub</h2>
      <p style="margin: 5px 0 0;">Your Exclusive Coupon Code For Service Reviews</p>
    </div>

    <div style="padding: 30px;">
      
      <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 18px; text-align: center;">
        Thank you for your recent purchase! Use the coupon code to review our services.<br/><br/>
        <strong style="font-size: 24px; color: #3b82f6;">${couponCode}</strong>
      </div>
        <a href="https://smartautohub.live/review?code=${couponCode}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Write a Review</a>
    </div>
      

    <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px;">
      © ${new Date().getFullYear()} Smart Auto Hub
    </div>

  </div>
</div>
    `,
  });
}
