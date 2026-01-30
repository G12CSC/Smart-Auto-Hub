import { notFound } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import ChatBot from "@/components/ChatBot"
import VehicleDetailsClient from "./VehicleDetailsClient"
import { vehicleAPI } from "@/lib/api/vehicles"

export default async function VehicleDetailsPage({ params }) {
  const result = await vehicleAPI.getVehicleById(params.id)

  if (!result?.success) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <VehicleDetailsClient vehicle={result.data} vehicleId={params.id} />
      <ChatBot />
      <Footer />
    </div>
  )
}
