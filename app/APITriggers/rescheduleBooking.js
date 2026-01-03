import {prisma} from "../../lib/prisma.ts"
import {NextResponse} from "next/server";



export async function rescheduleBooking(bookingId,newDate,newTime) {


    try{

        const res=await fetch("/api/Consultations/rescheduleBooking/",{
            method:"PATCH",
            header:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                bookingId,newDate,newTime
            })
        })

        return await res.json();
    }
    catch(err){
        throw new Error(err);
    }


}