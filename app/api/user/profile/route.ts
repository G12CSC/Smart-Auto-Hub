import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || undefined },
      select: {
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return Response.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return new Response("An error occurred while fetching the profile", {
      status: 500,
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || undefined },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    await prisma.user.update({
      where: { email: session.user?.email || undefined },
      data: {
        name: body.name,
        phone: body.phone,
      },
    });
    return Response.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return new Response("An error occurred while updating the profile", {
      status: 500,
    });
  }
}

