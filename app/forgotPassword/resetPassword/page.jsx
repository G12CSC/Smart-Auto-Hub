"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    // redirect if no email
    if (!email) {
        router.push("/forgotPassword");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to reset password");
            }

            alert("Password reset successful");

            // redirect to login
            router.push("/login");

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
                <h2>Reset Password</h2>

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
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