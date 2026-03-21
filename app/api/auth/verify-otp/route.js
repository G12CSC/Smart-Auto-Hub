import { prisma } from "../../../../lib/prisma.ts";

export async function POST(req) {

    const { email, otp } = await req.json();

    const record = await prisma.passwordResetOTP.findFirst({
        where: { email, otp },
        orderBy: { createdAt: "desc" },
    });

    if (!record) {
        return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
        return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    return Response.json({ message: "OTP valid" });
}