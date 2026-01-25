import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "../../auth/[...nextauth]/route.ts";
import {requireAdmin} from "../../../../lib/guard.ts";


export async function GET() {

    const session = await getServerSession(authOptions);

    // 2️⃣ Enforce ADMIN-only access
    requireAdmin(session);

    const allBookings = await prisma.consultationBooking.findMany({
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(allBookings);
}

