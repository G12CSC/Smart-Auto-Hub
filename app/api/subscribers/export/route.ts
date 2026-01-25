import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const subscribers = await prisma.newsletterEntry.findMany({
    select: {
      email: true,
      createdAt: true,
      source: true
    },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Subscribers");

  worksheet.columns = [
    { header: "Email", key: "email", width: 35 },
    { header: "Subscribed At", key: "createdAt", width: 30 },
    { header: "Source", key: "source", width: 30 },
  ];

  subscribers.forEach((sub) => {
    worksheet.addRow({
      email: sub.email,
      createdAt: sub.createdAt.toISOString().split("T")[0],
      source: sub.source || "-",
    });
  });

  // Header styling
  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="newsletter-subscribers.xlsx"',
    },
  });
}
