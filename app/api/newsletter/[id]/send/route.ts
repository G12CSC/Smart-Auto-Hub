import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Client } from "@upstash/qstash";

const qstash =
  process.env.USE_QSTASH === "true"
    ? new Client({ token: process.env.QSTASH_TOKEN! })
    : null;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const broadcast = await prisma.newsletterBroadcast.create({
    data: {
      id: Date.now().toString(),
      newsletterId: (await params).id,
      status: "PENDING",
    },
  });

  if (process.env.USE_QSTASH !== "true") {
    await fetch("http://localhost:3000/api/workers/send-newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ broadcastId: broadcast.id }),
    });

    return NextResponse.json({ mode: "local-direct" });
  }

  await qstash!.publishJSON({
    url: `${process.env.BASE_URL}/api/workers/send-newsletter`,
    body: { broadcastId: broadcast.id },
  });

  return NextResponse.json({ mode: "qstash" });
}
