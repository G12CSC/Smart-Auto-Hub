import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const advisors = await prisma.admin.findMany({
        where: {
            role: "advisor",
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    return NextResponse.json({
        success: true,
        advisors,
    });
}