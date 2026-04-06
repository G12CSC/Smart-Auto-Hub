import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.ts";
import { revalidatePath } from "next/cache";

export async function GET(req, context) {

  const params = await context.params;
  const id = params.id;

  // If you use Next.js 13.4+ App Router:
  const carId = id; // string

  if (isNaN(carId)) {
    return new Response("Invalid ID", { status: 400 });
  }

  const car = await prisma.Car.findUnique({
    where: { id: carId }, // cast to number if your ID is Int
  });

  if (!car) return new Response("Car not found", { status: 404 });
  revalidatePath("/admin");

  return new Response(JSON.stringify(car), { status: 200 });
}

export async function PUT(request, context) {
  try {
    const params = await context.params;

    const data = await request.json();

    const updatedCar = await prisma.Car.update({
      where: {
        id: params.id,
      },
      data: data,
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return NextResponse.json(updatedCar);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const deletedCar = await prisma.Car.delete({
      where: { id: params.id },
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return NextResponse.json({ message: "Vehicle deleted successfully", success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 },
    );
  }
}
