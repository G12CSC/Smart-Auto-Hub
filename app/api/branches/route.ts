import { prisma } from "@/lib/prisma";
import { availableMemory } from "process";

export async function GET() {
  const vehicles = await prisma.car.findMany({
    include: {
      availability: true,
    },
  });

  function groupByLocation({
    location,
    ...rest
  }: {
    location: string | null | undefined;
  }) {
    return location === "Colombo" ? "Colombo" : location || "Unknown";
  }
  const grouped = Object.groupBy(vehicles, groupByLocation);
  return Response.json(grouped);
}
