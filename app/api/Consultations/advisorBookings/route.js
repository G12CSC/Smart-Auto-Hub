import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 1: Ensure this admin is an advisor
    const advisor = await prisma.admin.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!advisor) {
        return NextResponse.json(
            { error: "Not an advisor" },
            { status: 403 }
        );
    }

    // Step 2: Fetch bookings assigned to this advisor
    const bookings = await prisma.consultationBooking.findMany({
        where: {
            advisorId: advisor.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(bookings);
}
