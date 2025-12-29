import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, message } = await req.json();

  const broadcast = await prisma.newsletterBroadcast.create({
    data: {
      id: crypto.randomUUID(),
      title,
      message,
    },
  });

  return NextResponse.json(broadcast);
}

export async function GET() {
  const broadcasts = await prisma.newsletterBroadcast.findMany({
    orderBy: { createdAt: "desc" },
  });

    return NextResponse.json(broadcasts);
}