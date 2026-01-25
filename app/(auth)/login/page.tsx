"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import {FaFacebook, FaEye, FaEyeSlash, FaGithub} from "react-icons/fa";
import ChatBot from "@/components/ChatBot";

export default function LoginPage() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signIn("user-credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/dashboard",
            });
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen bg-muted/20">
            {/* LEFT SIDE (IMAGE / BRANDING) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-70"
                    style={{ backgroundImage: "url('/logoImg.jpeg')" }}
                />
                <div
                    className="absolute inset-0 bg-contain bg-left bg-no-repeat opacity-90"
                    style={{ backgroundImage: "url('/logoImg.jpeg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
                    <h2 className="text-5xl font-extrabold mb-6">
                        <span className="italic">Smart</span> Auto Hub
                    </h2>
                    <p className="text-xl text-gray-200 max-w-lg">
                        Sign in to manage your bookings and consultations.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE (FORM) */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-center mb-2 dark:text-black">Welcome Back</h1>
                    <p className="text-center text-gray-500 mb-6 dark:text-black">
                        Enter your credentials to continue
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-medium dark:text-black">Email</label>
                            <input
                                type="email"
                                className="w-full h-11 rounded-lg border px-3 dark:text-black"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium dark:text-black">Password</label>
                                <Link
                                    href="#"
                                    className="text-xs text-primary hover:underline dark:text-black"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Forgot password?
                                </Link>
                            </div>

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
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <button
                            disabled={loading}
                            className="w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:text-black">
                Or continue with
              </span>
                        </div>
                    </div>

                    {/* SOCIAL LOGIN */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => signIn("google")}
                            className="flex items-center justify-center gap-2 h-10 border rounded-lg hover:bg-gray-100 dark:text-black"
                        >
                            <FcGoogle size={20} />
                            Google
                        </button>

                        <button
                            onClick={() => signIn("github")}
                            className="flex items-center justify-center gap-2 h-10 border rounded-lg dark:text-black hover:bg-gray-100"
                        >
                            <FaGithub size={20} className="text-blue-600" />
                            Github
                        </button>
                    </div>

                    {/* REGISTER */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-primary">
                            Register
                        </Link>
                    </p>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        If you are an admin or an advisor
                        <Link href="/admin/login" className="font-semibold text-primary">
                            Go to admin Portal Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* CHATBOT */}
            <ChatBot />
        </main>
    );
}
