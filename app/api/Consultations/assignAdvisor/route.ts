import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendAdvisorAssignmentEmail } from "@/lib/sendEmailtoAdvisorBooking";

export async function POST(req: Request) {

    const { bookingId, advisorId } = await req.json();

    const advisor = await prisma.admin.findUnique({
        where: { 
            id: advisorId,
            role: "advisor",
        },

    });

    const booking = await prisma.consultationBooking.update({
        where: { id: bookingId },
        data: {
            advisorId,
            status: "FORWARDED",
        },
    });

    // send email to advisor
    if (advisor) {
        await sendAdvisorAssignmentEmail(advisor.email, booking, advisor.name);
    }

    return NextResponse.json({ success: true, booking });
}
