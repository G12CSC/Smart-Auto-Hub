import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

    const advisors = await prisma.admin.findMany({
        where: {
            role: "advisor"
        },
        include: {
            advisorProfile: true
        }
    })

    const formatted = advisors.map((advisor) => ({
        id: advisor.id,
        name: advisor.name,
        email: advisor.email,
        phone: advisor.advisorProfile?.phone,
        specialization: advisor.advisorProfile?.specialization,
        experience: advisor.advisorProfile?.experience,
        rating: advisor.advisorProfile?.rating ?? 0,
        image: advisor.advisorProfile?.avatar,

    }))

    return NextResponse.json(formatted)
}