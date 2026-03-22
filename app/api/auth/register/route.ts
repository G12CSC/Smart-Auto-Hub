import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit/auditLogger";

export async function POST(req: Request) {
  try {
    const { username, email, password, phone, countryCode } = await req.json();

    // check if exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    const hash = await bcrypt.hash(password, 12);

    const fullPhone = `${countryCode}${phone}`;

    await prisma.user.create({
      data: {
        name: username,
        email,
        passwordHash: hash,
        phone: fullPhone,
      },
    });

    await logAudit({
      action: "REGISTER_USER",
      entity: "user",
      entityId: email,
      userId: email,
      userRole: "user",
      metadata: { email },
    });

    return NextResponse.json(
      { message: "User Registered successfully" },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
