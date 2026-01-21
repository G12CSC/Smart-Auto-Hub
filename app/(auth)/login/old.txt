"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import ChatBot from "@/components/ChatBot";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-semibold text-center mb-8">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="font-medium">Email</label>
            <input
              className="w-full border rounded-lg px-4 py-2"
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Password</label>
            <input
              className="w-full border rounded-lg px-4 py-2"
              type="password"
              placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* SOCIAL LOGIN BUTTONS SECTION */}

        <div className="mt-6 space-y-2">
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 py-2 rounded-lg border hover:bg-gray-200 transition"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <button
            onClick={() => signIn("facebook")}
            className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition"
          >
            <FaFacebook size={22} />
            Continue with Facebook
          </button>
        </div>
      </div>
      <ChatBot />
    </main>
  );
}
