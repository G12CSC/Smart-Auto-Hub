import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route.ts"
import { prisma } from "../../../../lib/prisma.ts"
import { NextResponse } from "next/server"

export async function GET() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.consultationBooking.updateMany({
        where: {
            status: { in: ["PENDING", "ACCEPTED","REJECTED"] },
            preferredDate: { lt: new Date() },
            userId:session.user.id
        },
        data: { status: "COMPLETED" },
    });

    // 2️⃣ Fetch upcoming
    const upcoming = await prisma.consultationBooking.findMany({
        where: {
            status: { in: ["PENDING", "ACCEPTED","REJECTED"] },
            preferredDate: { gte: new Date() },
            userId:session.user.id
        },
        orderBy: { createdAt: "desc" },
    });

    // 3️⃣ Fetch history
    const history = await prisma.consultationBooking.findMany({
        where: {
            status: "COMPLETED",
            userId:session.user.id
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ upcoming, history });
}

