import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");

  if (!brand) return NextResponse.json([]);

  const models = await prisma.car.findMany({
    where: { brand },
    distinct: ["model"],
    select: { model: true },
    orderBy: { model: "asc" }
  });

  return NextResponse.json(models.map(m => m.model));
}