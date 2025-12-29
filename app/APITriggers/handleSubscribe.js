"use client";

import { toast } from "sonner";

async function handleSubscribe(email, session, setEmail) {
  if (!email) {
    toast.error("Please enter your email");
    return;
  }

  const loadingToast = toast.loading("Subscribing...");

  try {
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        userId: session || null, // optional if using NextAuth
      }),
    });

    const data = await res.json();

    toast.dismiss(loadingToast);

    if (res.ok) {
      toast.success(
        data.success || "Thanks for subscribing! Check your inbox.",
        {
          icon: "📬",
        }
      );
      if (setEmail) setEmail(""); //clear input
    } else {
      toast.error(data.error || "Failed to subscribe");
    }
  } catch (err) {
    console.error(err);
    toast.dismiss(loadingToast);
    toast.error("Network error. Please try again.");
  }
}

export { handleSubscribe };
