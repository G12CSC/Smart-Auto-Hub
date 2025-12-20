import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route.ts"
import { prisma } from "../../../../lib/prisma.ts"
import { NextResponse } from "next/server"

export async function GET() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appointments = await prisma.ConsultationBooking.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            preferredDate: "desc",
        },
    })

    return NextResponse.json(appointments)
}
