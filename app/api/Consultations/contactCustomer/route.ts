import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { bookingId, email, phone, message } = await request.json();

  // Store the message in the database for record-keeping.
  await prisma.consultationBooking.update({
    where: {
      id: bookingId,
    },
    data: {
      advisorMessage: message,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Message sent to customer successfully.",
  });
}
