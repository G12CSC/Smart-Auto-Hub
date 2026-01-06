// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";
// import ChatBot from "@/components/ChatBot";

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     setLoading(false);

//     if (res?.error) {
//       setError("Invalid email or password");
//       return;
//     }

//     router.push("/");
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="bg-white w-full max-w-md shadow-xl rounded-xl p-8">
//         <h1 className="text-3xl font-semibold text-center mb-8">Login</h1>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label className="font-medium">Email</label>
//             <input
//               className="w-full border rounded-lg px-4 py-2"
//               type="email"
//               placeholder="example@gmail.com"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="font-medium">Password</label>
//             <input
//               className="w-full border rounded-lg px-4 py-2"
//               type="password"
//               placeholder="Your password"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//           <button
//             disabled={loading}
//             className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* SOCIAL LOGIN BUTTONS SECTION */}

//         <div className="mt-6 space-y-2">
//           <button
//             onClick={() => signIn("google")}
//             className="w-full flex items-center justify-center gap-3 py-2 rounded-lg border hover:bg-gray-200 transition"
//           >
//             <FcGoogle size={22} />
//             Continue with Google
//           </button>

//           <button
//             onClick={() => signIn("facebook")}
//             className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition"
//           >
//             <FaFacebook size={22} />
//             Continue with Facebook
//           </button>
//         </div>
//       </div>
//       <ChatBot />
//     </main>
//   );
// }


//Here is the current code.

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import ChatBot from "@/components/ChatBot";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="flex min-h-screen w-full overflow-hidden bg-muted/20">
      {/* SIDE A: VISUAL (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/luxury-showroom-interior.jpg')" }}
        ></div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Smart Auto Hub</h2>
          <p className="text-lg text-gray-200 max-w-md leading-relaxed">
            Experience the future of automotive excellence. Sign in to manage your bookings and preferences.
          </p>
        </div>
      </div>

      {/* SIDE B: FUNCTIONAL */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
        <div className="w-full max-w-[450px]">
          
          {/* FLOATING FORM CARD */}
          <div className="bg-card text-card-foreground shadow-xl rounded-2xl border border-border/40 ring-1 ring-gray-200 p-8 md:p-10 relative z-20">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email Address
                </label>
                <input
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none">Password</label>
                  <Link 
                    href="#" 
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={(e) => e.preventDefault()} // Placeholder implementation
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100 animate-in fade-in-50">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 shadow-sm"
              >
                <FcGoogle size={20} />
                Google
              </button>

              <button
                onClick={() => signIn("facebook")}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 shadow-sm"
              >
                <FaFacebook size={20} className="text-blue-600" />
                Facebook
              </button>
            </div>

            {/* REGISTER LINK */}
            <div className="mt-8 text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link 
                  href="/register" 
                  className="font-semibold text-primary hover:underline underline-offset-4"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* CHATBOT */}
      <ChatBot />
    </div>
  );
}