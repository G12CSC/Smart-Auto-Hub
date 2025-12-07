"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "../components/ui/button"
import { ChevronRight, Search, Calendar, MessageSquare, Star, Quote, Play } from "lucide-react"
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {useSession} from "next-auth/react";
import {handleSubscribe} from "@/app/APITriggers/handleSubscribe";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


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

const videoReviews = [
  {
    id: 1,
    title: "2022 Toyota Prius Full Review - Is It Worth The Money?",
    description:
      "Detailed walkthrough of the 2022 Toyota Prius including exterior, interior, features, and driving experience.",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
    uploadDate: "2 weeks ago",
  },
  {
    id: 2,
    title: "Honda Civic 2021 - Complete Technical Review",
    description:
      "In-depth technical analysis of the Honda Civic 2021 model, covering engine performance and safety features.",
    videoId: "dQw4w9WgXcQ",
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
    uploadDate: "1 month ago",
  },
  {
    id: 3,
    title: "Suzuki Swift 2023 - Best Value for Money?",
    description: "Comprehensive review of the Suzuki Swift 2023, discussing its pros and cons for Sri Lankan buyers.",
    videoId: "dQw4w9WgXcQ",
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
    uploadDate: "3 weeks ago",
  },
  {
    id: 4,
    title: "Wagon R 2021 - Family Car Test Drive",
    description: "Real-world test drive of the Wagon R 2021, perfect for families looking for space and comfort.",
    videoId: "dQw4w9WgXcQ",
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
    uploadDate: "1 week ago",
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
        className="relative h-[36rem] bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground flex items-center"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=576&width=1920&query=professional luxury car dealership showroom exterior with modern glass building)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-balance leading-tight">
              Find Your Next Vehicle at Sameera Auto Traders
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-95 text-balance leading-relaxed">
              Browse, book, and consult online—our entire inventory at your fingertips.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
              <Link href="/vehicles">Explore Vehicles</Link>
            </Button>
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
            <Select>
              <SelectTrigger className="flex-1 py-6 px-6 rounded-lg bg-input border-2 border-border text-foreground">
              <SelectValue placeholder="Filter by Location/Branch..." />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="nugegoda">Nugegoda Branch</SelectItem>
              <SelectItem value="colombo">Colombo Branch</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild className="h-13">
              <Link href="/vehicles">
              <Search size={18} className="mr-2" />
              Search
              </Link>
            </Button>
            </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold mb-2">Featured Vehicles</h2>
            <p className="text-muted-foreground text-lg">Handpicked selection from our premium inventory</p>
          </div>
          <Button variant="outline" asChild size="lg" className="hidden md:flex bg-transparent">
            <Link href="/vehicles">
              View All <ChevronRight size={18} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="relative h-52 bg-muted overflow-hidden">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span
                  className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm ${
                    vehicle.status === "Available" ? "bg-green-500/90 text-white" : "bg-yellow-500/90 text-white"
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{vehicle.name}</h3>
                <p className="text-primary font-bold text-xl mb-3">{vehicle.price}</p>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                  {vehicle.location}
                </p>
                <Button
                  variant="outline"
                  asChild
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                >
                  <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild size="lg">
            <Link href="/vehicles">
              View All Vehicles <ChevronRight size={18} />
            </Link>
          </Button>
        </div>
      </section>

      {/* YT Reviews */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Video Reviews by Sameera Auto Traders</h2>
            <p className="text-muted-foreground text-lg">Watch our detailed car reviews and technical insights</p>
          </div>
          <Button variant="outline" asChild size="lg" className="self-start md:self-auto bg-transparent">
            <a
              href="https://www.youtube.com/@SameeraAutoTraders"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5 fill-red-600" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Visit Channel
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoReviews.map((video) => (
            <div
              key={video.id}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-2xl hover:border-red-500/50 transition-all duration-300 group cursor-pointer"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")}
            >
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                  <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="text-white fill-current ml-1" size={28} />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 px-3 py-1 bg-red-600 text-white text-xs rounded-md font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{video.description}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  {video.uploadDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 py-20 mb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find your perfect vehicle in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl border border-border text-center hover:shadow-xl transition-shadow duration-300 relative group">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full shadow-lg text-white font-bold text-xl">
                1
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-6 mt-4 group-hover:scale-110 transition-transform">
                <Search className="text-blue-500" size={40} />
              </div>
              <h3 className="font-bold text-2xl mb-4">Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse our full inventory from all branches with advanced filters.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border text-center hover:shadow-xl transition-shadow duration-300 relative group">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg text-white font-bold text-xl">
                2
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-2xl mb-6 mt-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="text-green-500" size={40} />
              </div>
              <h3 className="font-bold text-2xl mb-4">Consult</h3>
              <p className="text-muted-foreground leading-relaxed">
                Book a meeting with our technical specialists for expert advice.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border text-center hover:shadow-xl transition-shadow duration-300 relative group">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full shadow-lg text-white font-bold text-xl">
                3
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-50 rounded-2xl mb-6 mt-4 group-hover:scale-110 transition-transform">
                <Calendar className="text-purple-500" size={40} />
              </div>
              <h3 className="font-bold text-2xl mb-4">Book</h3>
              <p className="text-muted-foreground leading-relaxed">
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
                image: "/professional-sri-lankan-businessman-customer-portr.jpg",
              },
              {
                name: "Nimal Perera",
                location: "Nugegoda",
                rating: 5,
                review:
                  "Very professional team. They helped me understand every detail about the Honda Civic I purchased. Highly recommend!",
                date: "1 month ago",
                image: "/satisfied-male-customer-with-car-keys-smiling.jpg",
              },
              {
                name: "Samantha Silva",
                location: "Kandy",
                rating: 4,
                review:
                  "Great experience overall. The consultation service was particularly helpful in making my decision. Will definitely come back.",
                date: "3 weeks ago",
                image: "/professional-woman-customer-happy-with-new-car.jpg",
              },
              {
                name: "Priya Wickramasinghe",
                location: "Galle",
                rating: 5,
                review:
                  "Best car dealership I've dealt with! Transparent pricing, no hidden charges, and excellent after-sales support.",
                date: "1 week ago",
                image: "/happy-female-customer-in-front-of-dealership.jpg",
              },
              {
                name: "Kasun Jayawardena",
                location: "Colombo",
                rating: 5,
                review:
                  "The technical specialist provided valuable insights. Found exactly what I was looking for within my budget.",
                date: "2 months ago",
                image: "/satisfied-young-man-with-new-car-showing-thumbs-up.jpg",
              },
            ].map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4">
                  <div className="bg-card rounded-lg p-6 border border-border h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                      <Quote className="h-8 w-8 text-primary/20 flex-shrink-0" />
                    </div>

                    <p className="text-muted-foreground mb-4 flex-grow leading-relaxed">{testimonial.review}</p>

                    <div className="pt-4 border-t border-border">
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
            <Button variant="secondary" onClick={()=>handleSubscribe(email,session?.user?.id)} className="h-12">
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