export async function cancelBookings(id){

    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    const res=await fetch("/api/Consultations/cancelBookings/", {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id:id
        })
    })

    if (!res.ok) {
        alert("Failed to cancel booking");
    }

    return res.json;

}