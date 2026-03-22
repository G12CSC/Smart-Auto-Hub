import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma.ts";

export async function POST(req) {
    const { email, newPassword } = await req.json();

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { passwordHash: hashed },
    });

    // delete OTPs
    await prisma.passwordResetOTP.deleteMany({
        where: { email },
    });

    return Response.json({ message: "Password updated" });
}