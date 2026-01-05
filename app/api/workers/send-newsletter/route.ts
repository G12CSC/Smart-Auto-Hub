import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { broadcastId } = await req.json();

  const broadcast = await prisma.newsletterBroadcast.findUnique({
    where: { id: broadcastId },
    include: { Newsletter: true },
  });

  if (!broadcast) {
    return NextResponse.json({ error: "Broadcast not found" });
  }

  await prisma.newsletterBroadcast.update({
    where: { id: broadcastId },
    data: { status: "PROCESSING" },
  });

  const subscribers = await prisma.newsletterEntry.findMany({
    where: { status: "ACTIVE" },
  });

  let sent = 0;

  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: "Smart Auto <onboarding@resend.dev>",
        to: sub.email,
        subject: broadcast.Newsletter.subject,
        html: broadcast.Newsletter.content,
      });

      sent++;

      await prisma.newsletterDeliveryLog.create({
        data: {
          id: Date.now().toString(),
          broadcastId,
          email: sub.email,
          status: "SENT",
        },
      });
    } catch (err) {
      await prisma.newsletterDeliveryLog.create({
        data: {
          id: Date.now().toString(),
          broadcastId,
          email: sub.email,
          status: "FAILED",
          errorMessage: String(err),
        },
      });
    }
  }

  await prisma.newsletterBroadcast.update({
    where: { id: broadcastId },
    data: {
      status: "COMPLETED",
      sentCount: sent,
      sentAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
