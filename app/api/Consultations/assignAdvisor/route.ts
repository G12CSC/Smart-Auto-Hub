import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { bookingId, advisorId } = await req.json();

    const booking = await prisma.consultationBooking.update({
        where: { id: bookingId },
        data: {
            advisorId,
            status: "FORWARDED",
        },
    });

    return NextResponse.json({ success: true, booking });
}
