"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import ChatBot from "@/components/ChatBot";

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+94");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleRegister = async (e: any) => {

        e.preventDefault();
        setLoading(true);
        setErr("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                email,
                username,
                password,
                phone: `${countryCode}${phone}`,
            }),
        });

        setLoading(false);

        if (!res.ok) {
            setErr("Account already exists");
            return;
        }

        router.push("/login");
    };

    const loginWithGoogle = () => {
        window.location.href = "/api/auth/google";
    };
    return (
        <main className="flex min-h-screen bg-muted/20">
            {/* LEFT SIDE (VISUAL) */}
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
                        Join us and experience the future of automotive excellence.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE (FORM) */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6 border">
                    <h1 className="text-3xl font-bold text-center dark:text-black">Create Account</h1>
                    {/* GOOGLE */}
                    <button
                        onClick={loginWithGoogle}
                        className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl hover:bg-gray-600 dark:text-black transition font-medium"
                    >
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>

                    {/* OR */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-gray-400 text-sm dark:text-black">OR</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* REGISTER FORM */}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <label className="font-medium dark:text-black">Username</label>
                            <input
                                type="text"
                                placeholder="johndoe123"
                                className="w-full border rounded-xl px-4 py-2.5 mt-1 dark:text-black"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="font-medium dark:text-black">Email</label>
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                className="w-full border rounded-xl px-4 py-2.5 mt-1 dark:text-black"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="font-medium dark:text-black">Phone Number</label>
                            <div className="flex gap-2 mt-1">
                                <select
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="border rounded-xl px-3 py-2 dark:text-black"
                                >
                                    <option value="+94">🇱🇰 +94</option>
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+61">🇦🇺 +61</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="7xxxxxxx"
                                    className="flex-1 border rounded-xl px-4 py-2 dark:text-black"
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-medium dark:text-black">Password</label>
                            <input
                                type="password"
                                placeholder="Minimum 6 characters"
                                className="w-full border rounded-xl px-4 py-2.5 mt-1 dark:text-black"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {err && (
                            <p className="text-red-500 text-center text-sm dark:text-black">{err}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-900 transition font-semibold shadow"
                        >
                            {loading ? "Creating..." : "Register"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm pt-2">
                        Already have an account?
                        <span
                            onClick={() => router.push("/login")}
                            className="text-blue-600 cursor-pointer font-medium pl-1 hover:underline"
                        >
              Login
            </span>
                    </p>
                </div>
            </div>

            <ChatBot />
        </main>
    );
}
