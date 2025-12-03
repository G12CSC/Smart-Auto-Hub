"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "../components/ui/button"
import { ChevronRight, Search, Calendar, MessageSquare, Star, Quote } from "lucide-react"
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {useSession} from "next-auth/react";
import {handleSubscribe} from "@/app/APITriggers/handleSubscribe";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


interface Vehicle {
  id: number
  name: string
  price: string
  status: "Available" | "Shipped" | "Not Available"
  image: string
  location: string
}

const featuredVehicles: Vehicle[] = [
  {
    id: 1,
    name: "2022 Toyota Prius",
    price: "LKR 17,500,000",
    status: "Available",
    image: "/toyota-prius-2022.jpg",
    location: "Nugegoda Branch",
  },
  {
    id: 2,
    name: "2021 Honda Civic",
    price: "LKR 15,200,000",
    status: "Available",
    image: "/honda-civic-2021.jpg",
    location: "Nugegoda Branch",
  },
  {
    id: 3,
    name: "2023 Suzuki Swift",
    price: "LKR 12,800,000",
    status: "Shipped",
    image: "/suzuki-swift-2023.jpg",
    location: "Nugegoda Branch",
  },
  {
    id: 4,
    name: "2021 Suzuki Wagon R",
    price: "LKR 6,800,000",
    status: "Available",
    image: "/suzuki-wagon-r-2021.jpg",
    location: "Nugegoda Branch",
  },
]

export default function Home() {


    const [email, setEmail] = useState<string>("")
    const {data:session} = useSession();


  return (
    <div className="min-h-screen bg-background">
      <Header />


        {/* SHOW LOGGED USER */}
        {session && (
            <div className="text-center py-4 bg-green-100 text-green-700">
                Welcome, <b>{session.user?.name || session.user?.email}</b> 👋
            </div>
        )}

      {/* Hero Section */}
      <section
        className="relative h-96 bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center"
        style={{
          backgroundImage: "url(/placeholder.svg?height=400&width=1200&query=car showroom professional)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 text-balance">Find Your Next Vehicle at Sameera Auto Traders</h1>
            <p className="text-xl mb-8 opacity-90 text-balance">
              Browse, book, and consult online—our entire inventory at your fingertips.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10 mb-16">
        <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by Make, Model..."
              className="flex-1 px-4 py-3 rounded bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Filter by Location/Branch..."
              className="flex-1 px-4 py-3 rounded bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button asChild className="h-12">
              <Link href="/vehicles">
                <Search size={18} className="mr-2" />
                Search
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Vehicles</h2>
          <Button variant="outline" asChild>
            <Link href="/vehicles">
              View All <ChevronRight size={18} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition"
            >
              <div className="relative h-48 bg-muted">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded text-sm font-semibold ${
                    vehicle.status === "Available"
                      ? "bg-green-500/20 text-green-700"
                      : "bg-yellow-500/20 text-yellow-700"
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{vehicle.name}</h3>
                <p className="text-primary font-semibold mb-3">{vehicle.price}</p>
                <p className="text-sm text-muted-foreground mb-4">{vehicle.location}</p>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/5 py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Search className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3">Search</h3>
              <p className="text-muted-foreground">
                Browse our full inventory from all branches with advanced filters.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <MessageSquare className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3">Consult</h3>
              <p className="text-muted-foreground">Book a meeting with our technical specialists for expert advice.</p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Calendar className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3">Book</h3>
              <p className="text-muted-foreground">
                Secure your vehicle with an online appointment at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {[
              {
                  name: "Rajith Fernando",
                  location: "Colombo",
                  rating: 5,
                  review:
                    "Excellent service! Found the perfect Toyota Prius for my family. The online booking system made everything so convenient.",
                  date: "2 weeks ago",
                },
                {
                  name: "Nimal Perera",
                  location: "Nugegoda",
                  rating: 5,
                  review:
                    "Very professional team. They helped me understand every detail about the Honda Civic I purchased. Highly recommend!",
                  date: "1 month ago",
                },
                {
                  name: "Samantha Silva",
                  location: "Kandy",
                  rating: 4,
                  review:
                    "Great experience overall. The consultation service was particularly helpful in making my decision. Will definitely come back.",
                  date: "3 weeks ago",
                },
                {
                  name: "Priya Wickramasinghe",
                  location: "Galle",
                  rating: 5,
                  review:
                    "Best car dealership I've dealt with! Transparent pricing, no hidden charges, and excellent after-sales support.",
                  date: "1 week ago",
                },
                {
                  name: "Kasun Jayawardena",
                  location: "Colombo",
                  rating: 5,
                  review:
                    "The technical specialist provided valuable insights. Found exactly what I was looking for within my budget.",
                  date: "2 months ago",
                },
              ].map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <div className="bg-card rounded-lg p-6 border border-border h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <Quote className="h-8 w-8 text-primary/20" />
                      </div>

                      <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">{testimonial.review}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Get Updates on New Stock & Offers</h2>
          <p className="mb-6 opacity-90">Subscribe to our newsletter for exclusive deals and new vehicle arrivals.</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button variant="secondary" onClick={()=>handleSubscribe(email,session?.user?.id)}>
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Chatbot Icon */}
      <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg cursor-pointer hover:scale-110 transition">
        <MessageSquare size={32} />
      </div>

      <Footer />
    </div>
  )
}