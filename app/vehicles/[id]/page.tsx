import { notFound } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import ChatBot from "@/components/ChatBot"
import VehicleDetailsClient from "./VehicleDetailsClient"
import { prisma } from "@/lib/prisma"


export default async function VehicleDetailsPage({
                                                     params,
                                                 }: {
    params: { id: string }
}) {

    const vehicleId = params.id;



    const vehicle = await prisma.car.findUnique({
        where: { id: vehicleId },
    })

    if (!vehicle) {
        notFound()
    }

    // 🔁 map DB fields → UI fields
    const mappedVehicle = {
        id: vehicle.id,
        name: `${vehicle.brand} ${vehicle.model}`,
        price: vehicle.price,
        year: vehicle.year,
        mileage: vehicle.mileage,

        make: vehicle.brand,
        model: vehicle.model,

        image: vehicle.images?.[0] ?? undefined,
        images: vehicle.images ?? [],

        //status: vehicle.status ?? undefined,
        location: vehicle.location ?? undefined,
        transmission: vehicle.transmission ?? undefined,
        fuelType: vehicle.fuelType ?? undefined,
        //type: vehicle.type ?? undefined,

        //description: vehicle.description ?? undefined,
    }
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <VehicleDetailsClient
                vehicle={mappedVehicle}
                vehicleId={String(vehicle.id)}
            />
            <ChatBot />
            <Footer />
        </div>
    )
}
