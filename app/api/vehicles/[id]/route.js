import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/prisma.ts";

export async function GET(req, context) {

    const params = await context.params;
    const id = params.id;


    // If you use Next.js 13.4+ App Router:
    const carId = id;  // string

    if(isNaN(carId)) {
        return new Response("Invalid ID", { status: 400 });
    }

    const car = await prisma.Car.findUnique({
        where: { id:carId }, // cast to number if your ID is Int
    });

    if (!car) return new Response("Car not found", { status: 404 });

    return new Response(JSON.stringify(car), { status: 200 });
}
