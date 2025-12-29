import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { renderNewsletterTemplate } from "@/lib/renderNewsletter";
import { sendInBatches } from "@/utils/sendNewsletterInBatches";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
  console.log("Sending newsletter...");
  console.log("Newsletter ID:", id);
  const broadcast = await prisma.newsletterBroadcast.findUnique({
    where: { id },
  });

  if (!broadcast) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  //console.log("Found broadcast:", broadcast.title);

  const subscribers = await prisma.newsletterEntry.findMany({
    where: { status: "ACTIVE" },
  });
  //console.log("Found subscribers:", subscribers.length);

  const html = renderNewsletterTemplate(broadcast.title, broadcast.message);
  if (!html) {
    console.log("Failed to render newsletter template");
    return NextResponse.json(

      { error: "Failed to render newsletter" },
        { status: 500 }
    );
  }

  await sendInBatches(
    subscribers.map((s) => s.email),
    broadcast.title,
    html
  );

  await prisma.newsletterBroadcast.update({
    where: { id: params.id },
    data: { sentAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
