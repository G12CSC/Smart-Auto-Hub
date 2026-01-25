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

//this api trigger calls the above api endpoint once the user has clicked approve or reject buttons to update ConsultationBooking reqs
