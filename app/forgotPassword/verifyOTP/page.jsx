"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOTPPage() {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // get email from URL
    const email = searchParams.get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            alert("Please enter OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid OTP");
            }

            alert("OTP verified successfully");

            // redirect to reset password page
            router.push(`/forgotPassword/resetPassword?email=${email}`);

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <h2>Verify OTP</h2>

                <p style={{ fontSize: "14px", color: "#555" }}>
                    Enter the OTP sent to your email
                </p>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f6f8",
    },
    card: {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        background: "#0f172a",
        color: "#fff",
        cursor: "pointer",
    },
};