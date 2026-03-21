import { prisma } from "../../../../lib/prisma.ts";
import { transporter } from "../../../../lib/zohoTransporter.js";
import {sendResetOTP} from "../../../../lib/sendResetOTP.js";

export async function POST(req) {

    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.passwordResetOTP.create({
        data: {
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        },
    });

    await sendResetOTP(email,otp);

    return Response.json({ message: "OTP sent" });
}