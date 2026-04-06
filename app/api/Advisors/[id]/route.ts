import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { logAudit } from "@/lib/audit/auditLogger";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  console.log("Advisor ID:", id);

  if (!id) {
    return Response.json(
      { success: false, message: "Advisor ID missing" },
      { status: 400 }
    );
  }

  try {
    await prisma.admin.delete({
      where: { id: id },
    });

    await logAudit({
      action: "DELETE_ADVISOR",
      entity: "advisor",
      entityId: id,
      userId: "admin", 
      userRole: "admin",
      metadata: { advisorId: id },
    });

    revalidatePath("/admin");

    return Response.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}