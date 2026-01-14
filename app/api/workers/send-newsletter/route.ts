import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const { broadcastId } = await req.json();

  // 1. Load broadcast + newsletter
  const broadcast = await prisma.newsletterBroadcast.findUnique({
    where: { id: broadcastId },
    include: {
      Newsletter: true,
    },
  });

  if (!broadcast || broadcast.status !== "PROCESSING") {
    return NextResponse.json({ ignored: true });
  }

  // 2. Load subscribers
  const subscribers = await prisma.newsletterEntry.findMany();
  let sentCount = 0;

  // 4. Send emails
  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: "Sameera Auto Hub <onboarding@resend.dev>",
        to: sub.email,
        subject: broadcast.Newsletter.subject,
        html: broadcast.Newsletter.content,
      });

      await prisma.newsletterDeliveryLog.create({
        data: {
          id: crypto.randomUUID(),
          broadcastId,
          email: sub.email,
          status: "SENT",
        },
      });

      sentCount++;
    } catch (error: any) {
      await prisma.newsletterDeliveryLog.create({
        data: {
          id: crypto.randomUUID(),
          broadcastId,
          email: sub.email,
          status: "FAILED",
          errorMessage: error.message,
        },
      });
    }
  }

  // 5. Mark completed
  await prisma.newsletterBroadcast.update({
    where: { id: broadcastId },
    data: {
      status: "COMPLETED",
      sentCount,
      sentAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    sent: sentCount,
  });
}
