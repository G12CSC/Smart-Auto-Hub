import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logAudit } from "@/lib/audit/auditLogger";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || undefined },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user?.passwordHash || "",
    );

    if (!isPasswordValid) {
      return new Response("Current password is incorrect", { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user?.email || undefined },
      data: { passwordHash: hashedNewPassword },
    });

    await logAudit({
      action: "change_password",
      entity: "user",
      entityId: session.user?.email || undefined,
      userId: session.user?.email || undefined,
      userRole: "user",
      metadata: { email: session.user?.email },
    });

    return Response.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return new Response("An error occurred while changing the password", {
      status: 500,
    });
  }
}
