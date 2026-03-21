import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.buyerName || !body.brand) {
    return NextResponse.json({ success: false });
  }

  console.log("Transaction:", body);

  return NextResponse.json({ success: true });
}