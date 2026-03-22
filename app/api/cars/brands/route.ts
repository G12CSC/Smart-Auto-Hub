import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const brands = await prisma.car.findMany({
    distinct: ["brand"],
    select: { brand: true },
    orderBy: { brand: "asc" }
  });

  return NextResponse.json(brands.map(b => b.brand));
}