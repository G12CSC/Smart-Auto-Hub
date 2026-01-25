import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: newsletterId } = await params;

  
  await prisma.newsletterBroadcast.deleteMany({
    where: { newsletterId: newsletterId },
  });
  
  await prisma.newsletter.delete({
    where: { id: newsletterId },
  });

  return NextResponse.json({ success: true });
}
