import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || undefined },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.passwordHash || "",
    );

    if (!isPasswordValid) {
      return new Response("Password is incorrect", { status: 400 });
    }
    await prisma.user.delete({
      where: { email: session.user?.email || undefined },
    });
    return Response.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return new Response("An error occurred while deleting the account", {
      status: 500,
    });
  }
}
