import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "../../auth/[...nextauth]/route.ts";

export async function GET() {


    const allBookings = await prisma.consultationBooking.findMany({
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(allBookings);
}

