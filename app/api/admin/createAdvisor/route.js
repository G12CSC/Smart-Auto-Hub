import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendAdvisorTempID } from "../../../../lib/emailForAdvisorCreation.js";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return Response.json({ error: "Email required" }, { status: 400 });
        }

        const tempPassword = crypto.randomBytes(6).toString("hex");

        const hashed = await bcrypt.hash(tempPassword, 10);

        const advisor = await prisma.admin.create({
            data: {
                email,
                passwordHash: hashed,
                role: "advisor",
                mustChangePassword:true
            },
        });

        await sendAdvisorTempID(email, tempPassword);

        return Response.json({
            success: true,
            email: advisor.email,
            temporaryPassword: tempPassword,
        });

    } catch (error) {
            console.error("ERROR:", error); // 👈 ADD THIS
            return Response.json({ error: "Failed to create advisor" }, { status: 500 });

    }
}