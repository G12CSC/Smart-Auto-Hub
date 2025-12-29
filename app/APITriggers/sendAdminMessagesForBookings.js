export async function sendAdminMessagesForBookings(id){

    const msg=prompt("ENTER ADMIN MESSAGE FOR THIS BOOKING REQUEST");

    if(!msg){
        return;
    }

    await fetch(`/api/Consultations/admin/handleBookings/${id}`, {
        method:"PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
        adminMessage: msg,
    }),
    })
}