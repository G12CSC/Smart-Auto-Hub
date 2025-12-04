import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Award, Target, Users, Zap } from 'lucide-react'
import { MessageSquare } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      //dfsdfsdfsfs
      {/* Hero Section */}
      <section
        className="relative h-80 bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center"
        style={{
          backgroundImage: "url(/placeholder.svg?height=320&width=1200&query=modern car showroom building)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-5xl font-bold mb-4 text-balance">About Sameera Auto Traders</h1>
          <p className="text-xl opacity-90 text-balance">
            Your trusted partner in finding the perfect vehicle since we started our journey in the automotive industry.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Company Overview */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Sameera Auto Traders has been a leading automotive dealership in Sri Lanka, dedicated to providing
                quality vehicles and exceptional customer service. With years of experience in the automotive industry,
                we have built a reputation for reliability and transparency.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our journey began with a simple vision: to offer customers a comprehensive selection of vehicles at
                competitive prices, coupled with professional support and guidance throughout their purchasing journey.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we've expanded our operations to multiple branches across the country, serving thousands of
                satisfied customers and continuing our commitment to excellence in the automotive sector.
              </p>
            </div>
            <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
              <img src="/luxury-showroom-interior.jpg" alt="Showroom" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-secondary/5 rounded-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-primary" size={32} />
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide our customers with an exceptional automotive experience by offering quality vehicles,
                professional guidance, and innovative solutions that make finding the perfect car accessible and
                hassle-free.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-primary" size={32} />
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To be the most trusted and innovative automotive dealership platform in Sri Lanka, revolutionizing how
                customers discover, consult, and purchase vehicles through digital transformation and customer-centric
                solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section>
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Award className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-3">Quality</h3>
              <p className="text-sm text-muted-foreground">
                We ensure every vehicle meets our high standards for reliability and performance.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-3">Customer Focus</h3>
              <p className="text-sm text-muted-foreground">
                Your satisfaction and trust are at the heart of everything we do.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Zap className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-3">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                We leverage modern technology to enhance your automotive experience.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Target className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-3">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                We believe in honest dealings and clear communication with all our customers.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Why Choose Sameera Auto Traders?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-3">Wide Selection</h3>
              <p className="text-muted-foreground">
                Browse from hundreds of quality vehicles across multiple branches with real-time inventory updates.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-3">Expert Support</h3>
              <p className="text-muted-foreground">
                Our technical consultants are available to answer your questions and guide you through the buying
                process.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-3">Online Convenience</h3>
              <p className="text-muted-foreground">
                Search, compare, consult, and book appointments entirely online at your own pace.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-3">Competitive Pricing</h3>
              <p className="text-muted-foreground">
                Get the best value for your money with our transparent and competitive pricing structure.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-3">Flexible Financing</h3>
              <p className="text-muted-foreground">
                Use our leasing calculator to explore payment options that work best for your budget.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-3">Customer Service</h3>
              <p className="text-muted-foreground">
                We're committed to providing exceptional support before, during, and after your purchase.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-accent rounded-lg p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Vehicle?</h2>
          <p className="text-lg mb-8 opacity-90">
            Explore our inventory or schedule a consultation with our experts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" asChild>
              <Link href="/vehicles">Browse Vehicles</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/consultation">Book Consultation</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Chatbot Icon */}
       <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg cursor-pointer hover:scale-110 transition">
            <MessageSquare size={32} />
        </div>

      <Footer />
    </div>
  )
}
