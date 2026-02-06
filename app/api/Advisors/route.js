import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

    const advisors = await prisma.admin.findMany({
        where: {
            role:"advisor"
        },
    })

    return NextResponse.json(advisors)
}
