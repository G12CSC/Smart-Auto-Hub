import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendCouponCode } from "@/lib/sendCouponCode";


import jwt from "jsonwebtoken";

if (!process.env.COUPON_JWT_SECRET) {
  throw new Error("COUPON_JWT_SECRET is not defined in environment variables");
}

export const dynamic = "force-dynamic";

export async function GET() {
  const transactions = await prisma.transactions.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, transactions });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.buyerName || !body.brand) {
    return NextResponse.json({ success: false });
  }

  // find the car id in the database based on brand, model, year
  const car = await prisma.car.findFirst({
    where: {
      brand: body.brand,
      model: body.model,
      year: parseInt(body.year),
    },
  });

  if (!car) {
    return NextResponse.json({ success: false, message: "Car not found" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: body.buyerEmail,
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" });
  }

  const couponCode: string = jwt.sign(
    { email: body.buyerEmail, carId: car.id, transactionId: body.id },
    process.env.COUPON_JWT_SECRET,
    { expiresIn: "30d" },
  );

  const hashedCode = await bcrypt.hash(couponCode, 10);

  const transaction = await prisma.transactions.create({
    data: {
      id: crypto.randomUUID(),
      buyerName: body.buyerName,
      buyerEmail: body.buyerEmail,
      phone: body.phone,
      location: body.location,
      price: parseFloat(body.price),
      carId: car.id,
      userId: user.id,
      couponCode: hashedCode,
    },
  });



  return NextResponse.json({ success: true });
}
