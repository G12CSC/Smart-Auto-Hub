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

  const newslettersWithStatus = await Promise.all(
    newsletters.map(async (n) => {
      const broadcast = await prisma.newsletterBroadcast.findFirst({
        where: { newsletterId: n.id },
        orderBy: { createdAt: "desc" },
      });
      return {
        ...n,
        broadcasts: broadcast ? [broadcast] : [],
        sentAt: broadcast?.status === "COMPLETED" ? broadcast.createdAt : null,
      };
    }),
  );

  return NextResponse.json({
    success: true,
    data: {
      newsletters,
      newslettersWithStatus,
    },
  });
}