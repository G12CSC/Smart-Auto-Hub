import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req) {

    const session = await getServerSession(authOptions);
    if (!session || session.user.adminRole !== "advisor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, decision } = await req.json();

    if (!["ACCEPTED", "REJECTED"].includes(decision)) {
        return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const booking = await prisma.consultationBooking.update({
        where: { id: bookingId },
        data: {
            status: decision,
        },
    });

    return NextResponse.json({ success: true, booking });
}
