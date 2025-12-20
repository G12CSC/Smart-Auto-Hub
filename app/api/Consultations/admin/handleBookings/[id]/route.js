import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params; // ✅ FIXED
    const { status, adminMessage } = await req.json(); // ✅ FIXED

    const updatedBooking = await prisma.ConsultationBooking.update({
        where: { id },
        data: {
            ...(status && { status }),               // update only if provided
            ...(adminMessage && { adminMessage }),   // update only if provided
        },
    });

    return NextResponse.json(updatedBooking);
}
