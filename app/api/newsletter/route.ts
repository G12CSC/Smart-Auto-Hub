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
      createdAt: new Date(),
    },
  });

  return NextResponse.json(newsletter);
}

export async function GET() {

  const newsletters = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });


  return NextResponse.json(newsletters);
}