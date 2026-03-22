import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: newsletterId } = await params;

  console.log("Received request to delete newsletter:", newsletterId);
  if (!newsletterId || typeof newsletterId !== "string") {
    return NextResponse.json(
      { error: "Invalid newsletter ID" },
      { status: 400 },
    );
  }

  const broadcast = await prisma.newsletterBroadcast.findMany({
    where: { newsletterId },
  });

  await prisma.newsletterDeliveryLog.deleteMany({
    where: {
      broadcastId: { in: broadcast.map((b) => b.id) },
    },
  });

  await prisma.newsletterBroadcast.deleteMany({
    where: { newsletterId },
  });

  await prisma.newsletter.delete({
    where: { id: newsletterId },
  });

  return NextResponse.json({ success: true });
}
