import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: carId } = await params;

  
  await prisma.car.delete({
    where: { id: carId },
  });

  const remainingVehicles = await prisma.car.count();
  const newVehiclesList = await prisma.car.findMany();

  return NextResponse.json({ success: true, remainingVehicles, newVehiclesList });
}
