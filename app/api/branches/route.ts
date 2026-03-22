import { prisma } from "@/lib/prisma";
import { availableMemory } from "process";

export async function GET() {
  const vehicles = await prisma.car.findMany({
    include: {
      availability: true,
    },
  });

  const grouped = vehicles.reduce((acc: any, vehicle) => {
    const key =
      vehicle.location === "Colombo"
        ? "Colombo"
        : vehicle.location || "Unknown";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(vehicle);
    return acc;
  }, {});
  return Response.json(grouped);
}
