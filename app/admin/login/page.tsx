"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function AdminLoginPage() {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("admin-credentials", {
            email,
            password,
            redirect: false, // handle errors properly
            callbackUrl: "/admin",
        });

        setLoading(false);

        if (!res?.ok) {
            setError("Invalid admin email or password");
            return;
        }
        console.log("Login successful:", res);
        console.log(session?.user?.email?.split("@")[0].slice(0, 5));

        // redirect will happen automatically due to callbackUrl, but you can also do it manually if needed
        window.location.href = session?.user?.email?.split("@")[0].slice(0, 5) === "admin" ? "/admin" : "/advisor-dashboard";
        
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-muted/20 p-6">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 dark:text-black">
                    Admin / Advisor Login
                </h1>
                <p className="text-center text-gray-500 mb-6 dark:text-black">
                    Use your staff credentials to continue
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
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

                    <div>
                        <label className="text-sm font-medium dark:text-black">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full h-11 rounded-lg border px-3 pr-10 dark:text-black"
                                placeholder="Enter your password"
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

                    <button
                        disabled={loading}
                        className="w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Dont have an account yet?
                    <Link href="/admin/register" className="font-semibold text-primary">
                        Create A Staff Account
                    </Link>
                </p>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Not a staff member?{" "}
                    <Link href="/login" className="font-semibold text-primary">
                        User login
                    </Link>
                </p>
            </div>
        </main>
    );
}
