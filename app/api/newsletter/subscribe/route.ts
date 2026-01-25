import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NewsletterSource } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await prisma.newsletterEntry.upsert({
      where: { email },
      update: {
        status: "ACTIVE",
      },
      create: {
        email,
        userId,
        source: userId
          ? NewsletterSource.USER
          : NewsletterSource.GUEST,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
