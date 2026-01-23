import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {requireAdmin} from "@/lib/guard";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {

    const session = await getServerSession(authOptions);

    requireAdmin(session);

  const subscribers = await prisma.newsletterEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscribers);
}
