import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {

    try {
        const { email, userId } = await req.json();

        const existing = await prisma.newsletterEntry.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ message: "Already subscribed" });
        }

        await prisma.newsletterEntry.create({
            data: {
                email,
                userId: userId || null,  // logged in or not
                source: userId ? "USER" : "GUEST",
            }
        });

        return NextResponse.json({ message: "Subscribed successfully!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
