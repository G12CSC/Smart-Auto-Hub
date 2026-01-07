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

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Destructure fields from the incoming request (matching AddVehicleModal)
        const {
            make, 
            model, 
            year, 
            type, 
            mileage,
            transmission, 
            fuelType, 
            price, 
            location, // Branch name
            status, 
            description, 
            images
        } = body;

        // Basic validation
        if (!make || !model || !price) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create the Car record
        // Mapping form fields to Prisma schema fields
        const car = await prisma.Car.create({
            data: {
                brand: make,
                model: model,
                year: Number(year),
                bodyType: type,
                mileage: Number(mileage),
                transmission: transmission,
                fuelType: fuelType,
                price: Number(price),
                condition: description || "",
                images: images || [],
                location: location || "Nugegoda", // Default or provided location
                // We can also try to link availability if branch exists
            },
        });

        // Try to link to a branch if location matches a branch name
        if (location) {
            const branch = await prisma.Branch.findFirst({
                where: { name: location }
            });

            if (branch) {
                await prisma.Availability.create({
                    data: {
                        carId: car.id,
                        branchId: branch.id,
                        quantity: status === "Available" ? 1 : 0,
                    }
                });
            }
        }

        return NextResponse.json({ success: true, data: car });
    } catch (error) {
        console.error("Error creating vehicle:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
