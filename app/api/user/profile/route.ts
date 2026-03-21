import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logAudit } from "@/lib/audit/auditLogger";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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

    if (!session || !session.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        phone: body.phone,
      },
      select: {
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    await logAudit({
      action: "update_profile",
      entity: "user",
      entityId: session?.user?.id || undefined,
      userId: session?.user?.id || undefined,
      userRole: "user",
      metadata: { email: session?.user?.email || undefined },
    });

    return Response.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return new Response("An error occurred while updating the profile", {
      status: 500,
    });
  }
}
