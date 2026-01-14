import {prisma} from "../../../../lib/prisma.ts"
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "../../auth/[...nextauth]/route.ts"

export async function PATCH(req){

    try{

        const session=await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {bookingId,newDate,newTime}=await req.json();

        const dateTime = new Date(`${newDate}T${newTime}:00`);

        const updated = await prisma.consultationBooking.update({
            where: {
                id: bookingId,
                status: "PENDING",
            },
            data: {
                preferredDate: dateTime, // ✅ DateTime
                preferredTime: newTime,
            },
        });

        return NextResponse.json(updated);


        }

        catch(err) {

            console.log(err);
            return NextResponse.json(

                { error: "Reschedule failed" },
                { status: 500 }
            );
    }

}