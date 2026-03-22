import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendCouponCode } from "@/lib/sendCouponCode";

import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET() {
  const transactions = await prisma.transactions.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, transactions });
}

export async function POST(req: Request) {

  try {
    const body = await req.json();

    if (!process.env.COUPON_JWT_SECRET) {
      throw new Error("Missing JWT secret");
    }

    if (
      !body.buyerName ||
      !body.buyerEmail ||
      !body.brand ||
      !body.model ||
      !body.year
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const car = await prisma.car.findFirst({
      where: {
        brand: body.brand,
        model: body.model,
        year: Number(body.year),
      },
    });

    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: body.buyerEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const couponCode = jwt.sign(
      {
        tid: body.id,
      },
      process.env.COUPON_JWT_SECRET,
      { expiresIn: "30d" },
    );

    await prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.create({
        data: {
          id: crypto.randomUUID(),
          couponCode,
          expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await tx.transactions.create({
        data: {
          id: body.id,
          buyerName: body.buyerName,
          buyerEmail: body.buyerEmail,
          phone: body.phone,
          location: body.location,
          price: parseFloat(body.price),
          carId: car.id,
          userId: user.id,
          couponId: coupon.id,
        },
      });
    });

    await sendCouponCode({
      email: body.buyerEmail,
      couponCode,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in transaction POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
