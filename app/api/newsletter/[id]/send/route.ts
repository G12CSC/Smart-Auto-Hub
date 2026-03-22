import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { qstash } from "@/lib/qstash";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: newsletterId } = await params;
  console.log("Received request to send newsletter:", newsletterId);

  if (!newsletterId) {
    return NextResponse.json(
      {
        error: "Newsletter ID is required",
      },
      { status: 400 },
    );
  }
  // Create a new broadcast
  const broadcast = await prisma.newsletterBroadcast.create({
    data: {
      id: crypto.randomUUID(),
      newsletterId: newsletterId,
      status: "PENDING",
      createdAt: new Date(),
    },
  });

  await prisma.newsletterBroadcast.update({
    where: { id: broadcast.id },
    data: { status: "PROCESSING" },
  });

  if (!qstash) {
    await fetch("http://localhost:3000/api/workers/send-newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ broadcastId: broadcast.id }),
    });
    return NextResponse.json({ success: true });
  } else {
    await qstash.publish({
      url: "https://smartautohub.live/api/workers/send-newsletter",
      method: "POST",
      body: JSON.stringify({ broadcastId: broadcast.id }),
    });
  }

  return NextResponse.json({
    mode: "qstash",
    broadcastId: broadcast.id,
    success: true,
  });
}
