import { prisma } from "@/lib/prisma";
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

    const subscribers = await prisma.newsletterEntry.findMany({
        where: { status: "ACTIVE" },
    });

    const html = renderNewsletterTemplate(
        broadcast.title,
        broadcast.message
    );

    if (!html) {
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

    // ✅ FIXED: use `id`, NOT `params.id`
    await prisma.newsletterBroadcast.update({
        where: { id },
        data: { sentAt: new Date() },
    });

    return NextResponse.json({ success: true });
}
