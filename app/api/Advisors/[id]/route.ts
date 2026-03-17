import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

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