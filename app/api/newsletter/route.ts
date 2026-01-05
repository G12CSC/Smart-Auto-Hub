import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, subject, content } = await req.json();

  const newsletter = await prisma.newsletter.create({
    data: {
      id: crypto.randomUUID(),
      title,
      subject,
      content,
    },
  });

  await prisma.newsletterBroadcast.create({
    data: {
      id: crypto.randomUUID(),
      newsletterId: newsletter.id,
      status: "PENDING",
    },
  });

  return NextResponse.json(newsletter);
}

export async function GET() {
  const broadcasts = await prisma.newsletterBroadcast.findMany({
    orderBy: { createdAt: "desc" },
  });

    return NextResponse.json(broadcasts);
}