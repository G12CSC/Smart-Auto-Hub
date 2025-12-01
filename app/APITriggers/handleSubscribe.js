

async function handleSubscribe(email,session) {

    if (!email) {
        alert("Please enter your email");
        return;
    }

    try {
        const res = await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                userId: session || null,  // optional if using NextAuth
            }),
        });

        const data = await res.json();

        alert(data.message || data.error);

        if (res.ok) setEmail(""); // clear input
    } catch (err) {
        console.error(err);
        alert("Network error");
    }
}

export { handleSubscribe };