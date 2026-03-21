import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  if (!brand || !model) return NextResponse.json([]);

  const years = await prisma.car.findMany({
    where: { brand, model },
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" }
  });

  return NextResponse.json(years.map(y => y.year));
}