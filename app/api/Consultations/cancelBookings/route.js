import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/prisma.ts";

export async function PATCH(req){

    const {id}=await req.json();

    const updatedBooking=await prisma.consultationBooking.update({
        where:{
            id
        },

        data:{
            status:"CANCELLED"
        }
    })

    return NextResponse.json(updatedBooking);

}