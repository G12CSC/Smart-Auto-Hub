import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "Not authenticated",
      });
    }

    const reviews = await prisma.review.findMany({
      where: { userId: session?.user?.id },
      include: {
        car: true,
      },
    });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch user reviews",
    });
  }
}
