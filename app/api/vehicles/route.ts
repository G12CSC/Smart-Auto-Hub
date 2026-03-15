import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);

    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    //const minMileage = searchParams.get("minMileage");
    const maxMileage = searchParams.get("maxMileage");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    try {

        const vehicles = await prisma.car.findMany({
            where: {
                AND: [

                    brand
                        ? { brand: { contains: brand, mode: "insensitive" } }
                        : {},

                    model
                        ? { model: { contains: model, mode: "insensitive" } }
                        : {},

                    // minMileage
                    //     ? { mileage: { gte: Number(minMileage) } }
                    //     : {},

                    maxMileage
                        ? { mileage: { lte: Number(maxMileage) } }
                        : {},

                    minPrice
                        ? { price: { gte: Number(minPrice) } }
                        : {},

                    maxPrice
                        ? { price: { lte: Number(maxPrice) } }
                        : {},

                ],
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(vehicles);

    } catch (error) {

        return NextResponse.json(
            { error: "Failed to fetch vehicles" },
            { status: 500 }
        );

    }
}