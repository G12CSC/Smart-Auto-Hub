async function handleConsultationRequests(formData){

    const response=await fetch("/api/Consultations/createBooking",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error("Failed to submit consultation");
    }

    return await response.json();


}

export {handleConsultationRequests}

//this is the api handler to invoke the create consultation booking api logic..