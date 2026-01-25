import { NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma.ts";

export async function GET() {

    const cars = await prisma.Car.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Transform DB → UI format
    const vehicles = cars.map((car) => ({
        id: car.id,
        name: `${car.year} ${car.brand} ${car.model}`,
        make: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        transmission: car.transmission,
        fuelType: car.fuelType,
        type: car.bodyType,
        location: car.location,
        status: car.availability?.[0]?.status ?? "Available",
        images: car.images,
        image: car.images?.[0] ?? "/placeholder.svg",
        description: car.condition,
        reviews: car.reviews,
    }));

    return NextResponse.json(vehicles);
}
