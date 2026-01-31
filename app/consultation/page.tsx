import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";

// import { setTimeout } from "timers/promises"
import ConsultationForm from "@/components/consultation/consultation-form";

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section
        className="relative h-96 bg-linear-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center mb-24 animate-slide-in-down"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=384&width=1600&query=professional car consultation advisor customer meeting)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-6xl font-bold mb-4 text-balance animate-text-reveal">
            Book an Appointment
          </h1>
          <p className="text-xl opacity-90 text-balance max-w-2xl animate-text-reveal stagger-1">
            Connect with our technical experts for personalized vehicle guidance
            and advice.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-4 sticky top-40 self-start">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition animate-bounce-in-up delay-100">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/10">
                    <User className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Expert Guidance</h3>
                  <p className="text-sm text-muted-foreground">
                    Get personalized advice from our experienced technical
                    consultants.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition animate-bounce-in-up delay-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/10">
                    <Clock className="text-green-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Flexible Scheduling
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a time that works best for you, at your convenience.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition animate-bounce-in-up delay-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500/10">
                    <MapPin className="text-purple-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Multiple Locations</h3>
                  <p className="text-sm text-muted-foreground">
                    Meet at any of our branches or schedule an online
                    consultation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            {/* Consultation Form */}
            <ConsultationForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
