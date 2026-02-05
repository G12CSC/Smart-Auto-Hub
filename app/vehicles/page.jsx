import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import VehicleBrowser from "@/components/vehicles/vehicle-browser";
import {prisma} from "../../lib/prisma.ts"

export default async function VehiclesPage() {

  let vehicles = [];
  let error = null;

  try {

      vehicles=await prisma.car.findMany({
          orderBy: {
              createdAt: "desc",
          },
      })

  }catch(error) {
      error = error.message;
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="relative h-96 bg-linear-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center mb-24 animate-slide-in-down"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=384&width=1600&query=modern car showroom inventory luxury vehicles)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-6xl font-bold mb-4 text-balance animate-text-reveal">
            Find Your Perfect Car
          </h1>
          <p className="text-xl opacity-90 text-balance max-w-2xl animate-text-reveal stagger-1">
            Browse our extensive inventory of quality vehicles. From sedans to
            SUVs, we have something for everyone.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* <h1 className="text-4xl font-bold mb-8">Search Our Inventory</h1> */}
        <VehicleBrowser initialVehicles={vehicles} initialError={error} />
      </div>

      {/* Chatbot Icon */}
      <ChatBot />

      <Footer />
    </div>
  );
}
