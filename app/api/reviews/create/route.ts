import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { carId, rating, comment } = body;

    try {

        const review = await prisma.review.create({
            data: {
                carId,
                rating,
                comment,
                userId: session.user.id,
            },
        });

        return NextResponse.json(review);

    } catch (error) {

        return NextResponse.json(
            { error: "Failed to create review" },
            { status: 500 }
        );

    }
}