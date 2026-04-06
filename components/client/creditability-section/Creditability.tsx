import { statData } from "@/constants/stat.data";
import { BenefitsData } from "@/constants/benefits.data";
import { Calendar, MessageCircle, Search } from "lucide-react";

export default function Creditability() {
  return (
    <section className="py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance animate-text-reveal">
            Your Journey to the Perfect Vehicle
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto animate-text-reveal stagger-1">
            From discovery to ownership, we ensure every step builds trust and
            confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Step 1 */}
          <div className="bg-card p-8 rounded-xl border border-border text-center hover:shadow-xl transition-all duration-300 relative group hover-glow animate-bounce-in-up">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg text-white font-bold text-xl">
              1
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-2xl mb-6 mt-4 group-hover:scale-110 transition-transform">
              <Search className="text-blue-600 dark:text-blue-400" size={40} />
            </div>
            <h3 className="font-bold text-2xl mb-4">Search</h3>
            <p className="text-muted-foreground leading-relaxed">
              Browse our full inventory from all branches with advanced filters.
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border text-center hover:shadow-xl transition-all duration-300 relative group hover-glow animate-bounce-in-up stagger-1">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-16 h-16 bg-emerald-600 dark:bg-emerald-500 rounded-full shadow-lg text-white font-bold text-xl">
              2
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl mb-6 mt-4 group-hover:scale-110 transition-transform">
              <MessageCircle
                className="text-emerald-600 dark:text-emerald-400"
                size={40}
              />
            </div>
            <h3 className="font-bold text-2xl mb-4">Consult</h3>
            <p className="text-muted-foreground leading-relaxed">
              Book a meeting with our technical specialists for expert advice.
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border text-center hover:shadow-xl transition-all duration-300 relative group hover-glow animate-bounce-in-up stagger-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg text-white font-bold text-xl">
              3
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-6 mt-4 group-hover:scale-110 transition-transform">
              <Calendar className="text-primary" size={40} />
            </div>
            <h3 className="font-bold text-2xl mb-4">Book</h3>
            <p className="text-muted-foreground leading-relaxed">
              Secure your vehicle with an online appointment at your
              convenience.
            </p>
          </div>
        </div>

        <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-8 md:p-12 mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-text-reveal">
            Trusted by Thousands
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {statData.map((stat, index) => (
              <div
                key={index}
                className="text-center hover:scale-105 transition-transform duration-300 animate-pop-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {stat.label}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Customers Choose Sameera Auto Traders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BenefitsData.map((benefit, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-slide-in-right"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="font-bold text-xl mb-2">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
