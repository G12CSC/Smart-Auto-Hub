import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {


  const body = await req.json();
  console.log("Received review submission:", body);
  const { code, transaction, review, rating } = body;
  

  try {
    //console.log("Verifying coupon code:", code);
    const decoded: any = jwt.verify(code, process.env.COUPON_JWT_SECRET!);
    //console.log("Decoded JWT:", decoded);
    const getTransaction = await prisma.transactions.findUnique({
        where: { id: decoded.tid },
        include: {
            user: true,
        },
    });
    const submitedReview = await prisma.review.create({
      data: {
        id: getTransaction?.id || undefined,
        carId: getTransaction?.carId || undefined,
        userId: getTransaction?.userId || undefined,
        rating,
        comment: review || "",
        location: getTransaction?.location ,
        couponId: getTransaction?.couponId,
      },
    });

    return NextResponse.json(submitedReview);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
