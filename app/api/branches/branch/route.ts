import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);

  const branch = searchParams.get("branch");
  const brand = searchParams.get("brand");

  if (!branch) {
    return NextResponse.json(
      { error: "Branch is required" },
      { status: 400 }
    );
  }

  const vehicles = await prisma.car.findMany({
    where: {
      location: branch,
      brand: brand || undefined
    }
  });

  return NextResponse.json(vehicles);

}