import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.ts";

// GET /api/vehicles (get all vehicles)


export async function GET(req) {

    try {
        const { searchParams } = new URL(req.url);

        const brand = searchParams.get("brand");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");

        const vehicles = await prisma.Car.findMany({
            where: {
                ...(brand && { brand }),
                ...(minPrice && { price: { gte: Number(minPrice) } }),
                ...(maxPrice && { price: { lte: Number(maxPrice) } }),
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(vehicles);

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch vehicles" },
            { status: 500 }
        );
    }
}
