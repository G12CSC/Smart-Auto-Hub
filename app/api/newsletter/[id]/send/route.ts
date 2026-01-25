import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { qstash } from "@/lib/qstash";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id:newsletterId } = await params;
  console.log("Received request to send newsletter:", newsletterId);

  if (!newsletterId) {
    return NextResponse.json(
      { 
        error: "Newsletter ID is required" },
      { status: 400 }
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

  // 1. Mark as PROCESSING immediately
  await prisma.newsletterBroadcast.update({
    where: { id: broadcast.id },
    data: { status: "PROCESSING" },
  });

  // 2. If QStash disabled → local execution
  if (!qstash) {
    await fetch("http://localhost:3000/api/workers/send-newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ broadcastId: broadcast.id }),
    });
    return NextResponse.json({ success: true });
  }

  // 3. Publish job to QStash
  // await qstash.publishJSON({
  //   url: `${process.env.BASE_URL}/api/workers/send-newsletter`,
  //   body: {
  //     broadcastId: broadcast.id,
  //   },
  // });

  return NextResponse.json({
    mode: "qstash",
    broadcastId: broadcast.id,
    success: true,
  });

}
