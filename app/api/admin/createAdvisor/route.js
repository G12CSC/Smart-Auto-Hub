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

        const existing = await prisma.admin.findUnique({ where: { email } });

        if (existing) {
            return Response.json({ error: "Advisor already exists" }, { status: 400 });
        }

        const tempPassword = crypto.randomBytes(6).toString("hex");

        const hashed = await bcrypt.hash(tempPassword, 10);

        const newAdvisorName = email.split("@")[0].toString().charAt(0).toUpperCase() + email.split("@")[0].slice(1);

        const advisor = await prisma.admin.create({
            data: {
                name: newAdvisorName,
                email,
                passwordHash: hashed,
                role: "advisor",
                mustChangePassword:true
            },
        });

        await sendAdvisorTempID(email, tempPassword,email);

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