import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logAudit } from "@/lib/audit/auditLogger";

export async function POST(req) {
    try {
        // 1. Get session
        const session = await getServerSession(authOptions);

        if (!session || session.user.adminRole !== "advisor") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get data from request
        const body = await req.json();
        const { tempPassword, password } = body;

        if (!tempPassword || !password) {
            return Response.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // 3. Get advisor from DB
        const advisor = await prisma.admin.findUnique({
            where: { id: session.user.id },
        });

        if (!advisor) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // 4. Verify temp password
        const isValid = await bcrypt.compare(
            tempPassword,
            advisor.passwordHash
        );

        if (!isValid) {
            return Response.json(
                { error: "Invalid temporary password" },
                { status: 400 }
            );
        }

        // 5. Hash new password
        const hashed = await bcrypt.hash(password, 10);

        // 6. Update DB
        await prisma.admin.update({
            where: { id: advisor.id },
            data: {
                passwordHash: hashed,
                mustChangePassword: false,
            },
        });

        await logAudit({
            action: "CHANGE_PASSWORD",
            entity: "Advisor",
            entityId: advisor.id,
            metadata: {
                email: advisor.email,
            },
            userRole: "ADVISOR",
            userId: advisor.id,
            
        });

        return Response.json({ success: true });

    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}