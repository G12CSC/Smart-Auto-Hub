import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const vehicles = await prisma.car.findMany({
        include: {
            availability: true,
        },
    });

    return NextResponse.json(vehicles);
}