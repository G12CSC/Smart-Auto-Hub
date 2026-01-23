"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin"); // admin | advisor

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create admin account");
                setLoading(false);
                return;
            }

            setSuccess("Account created successfully. You can now log in.");
            setTimeout(() => router.push("/admin/login"), 1500);
        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-muted/20 p-6">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 dark:text-black">
                    Admin / Advisor Register
                </h1>
                <p className="text-center text-gray-500 mb-6 dark:text-black">
                    Create a staff account
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium dark:text-black">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full h-11 rounded-lg border px-3 dark:text-black"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium dark:text-black">Email</label>
                        <input
                            type="email"
                            className="w-full h-11 rounded-lg border px-3 dark:text-black"
                            placeholder="staff@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-sm font-medium dark:text-black">Role</label>
                        <select
                            className="w-full h-11 rounded-lg border px-3 dark:text-black"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="advisor">Advisor</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium dark:text-black">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full h-11 rounded-lg border px-3 pr-10 dark:text-black"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword((s) => !s)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    {success && (
                        <p className="text-sm text-green-600 text-center">{success}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have a staff account?{" "}
                    <Link href="/admin/login" className="font-semibold text-primary">
                        Login here
                    </Link>
                </p>
            </div>
        </main>
    );
}
