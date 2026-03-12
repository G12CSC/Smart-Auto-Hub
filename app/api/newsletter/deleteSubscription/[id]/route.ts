import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: newsletterSubscriber } = await params;

  await prisma.newsletterEntry.delete({
    where: { id: newsletterSubscriber },
  });

  const remainingSubscribers = await prisma.newsletterEntry.count();
  const newSubscribersList = await prisma.newsletterEntry.findMany();
  return NextResponse.json({ success: true, remainingSubscribers, newSubscribersList });
}
