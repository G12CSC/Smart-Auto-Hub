import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route' // adjust path if needed

export async function POST(req) {

    try {

        const session = await getServerSession(authOptions);

        const body = await req.json();

        await prisma.consultationBooking.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
                vehicleType: body.vehicleType,
                consultationType: body.consultationType,
                preferredDate: new Date(body.preferredDate),
                preferredTime: body.preferredTime,
                message: body.message,

                // ✅ Use session.user.id if logged in, otherwise null
                userId: session?.user?.id ?? null,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to create booking" },
            { status: 500 }
        );
    }
}

//this api handles with creating consultation bookings..