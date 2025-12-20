export async function approveBookings(id,status){

    await fetch(`/api/Consultations/admin/handleBookings/${id}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status
        })
    })
}