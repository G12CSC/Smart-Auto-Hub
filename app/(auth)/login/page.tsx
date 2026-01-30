import ChatBot from "@/components/ChatBot";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
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
                    <LoginForm />
                </div>
            </div>

            {/* CHATBOT */}
            <ChatBot />
        </main>
    );
}
