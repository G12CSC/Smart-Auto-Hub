export async function cancelBookings(id){

    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    await fetch(`/api/Consultations/admin/handleBookings/${id}`, {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status:"CANCELLED"
        })
    })

    if (!res.ok) {
        alert("Failed to cancel booking");
    }

}