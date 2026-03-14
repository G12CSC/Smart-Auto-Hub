import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/prisma";

export async function GET() {
    
    const vehicles = await prisma.car.findMany();
    return NextResponse.json(vehicles.length);
}