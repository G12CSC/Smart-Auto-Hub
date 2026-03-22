import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ carId: string }> },
) {
  try {
    const { carId } = await params;
    console.log("Fetching reviews for carId:", carId);
    const reviews = await prisma.review.findMany({
      where: {
        carId: carId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // reshape response
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      name: review.user?.name || "Anonymous",
      timestamp: review.createdAt,
      userId: review.userId,
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
