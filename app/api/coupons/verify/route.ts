import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { success: false, message: "Missing code" },
      { status: 400 },
    );
  }

  try {
    const decoded: any = jwt.verify(code, process.env.COUPON_JWT_SECRET!);

    const coupon = await prisma.coupon.findFirst({
      where: {
        couponCode: code,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon" },
        { status: 404 },
      );
    }

    if (coupon.expireAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "Coupon expired" },
        { status: 400 },
      );
    }

    const transaction = await prisma.transactions.findUnique({
      where: { id: decoded.tid },
      include: {
        car: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction.id,
        carId: transaction.car.id,
        brand: transaction.car.brand,
        model: transaction.car.model,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }
}
