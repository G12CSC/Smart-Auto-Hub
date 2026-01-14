import { NextResponse } from "next/server";

const ADMIN_EMAIL = "smartautohubadmin@support.com";
const ADMIN_PASSWORD = "smartautohub@open";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Invalid admin credentials" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Admin login successful",
  });

  response.cookies.set("isAdmin", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return response;
}
