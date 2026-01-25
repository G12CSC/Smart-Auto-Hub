import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, {
    params,}: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    const newsletter = await prisma.newsletter.findUnique({
        where: { id },
    });
    return NextResponse.json(newsletter);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { title, subject, content } = await req.json();
  const { id } = await params;
    const newsletter = await prisma.newsletter.update({
        where: { id },
        data: {
            title,
            subject,
            content,
        },
    });
    return NextResponse.json(newsletter);
}
