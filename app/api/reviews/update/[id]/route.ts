import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { rating, comment } = body;

    const review = await prisma.review.findUnique({
        where: { id: params.id },
    });

    if (review?.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.review.update({
        where: { id: params.id },
        data: {
            rating,
            comment,
        },
    });

    return NextResponse.json(updated);
}