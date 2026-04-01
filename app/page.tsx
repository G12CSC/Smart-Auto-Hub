import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "../components/ui/button";
import {
  ChevronRight,
  Play,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import { getVideoReviews } from "@/app/actions/videoActions";
import UserWelcome from "@/components/home/user-welcome";
import TestimonialsCarousel from "@/components/home/testimonials-carousel";
import NewsletterForm from "@/components/home/newsletter-form";
import FeedbackPopup from "@/components/advertisements/findVehicle/FeedbackPopup";
import Creditability from "@/components/client/creditability-section/Creditability";
import { VideoReviews } from "@/components/client/video-section/VideoReviews";

interface VideoReview {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  createdAt: Date;
}

export default async function Home() {
  const videoData = await getVideoReviews();
  const videoReviews = videoData.success
    ? (videoData.data as VideoReview[])
    : [];

    const featuredVehicles = await prisma.car.findMany({
        take: 4,
        orderBy: {
            createdAt: "desc",
        }
    });

  return (
    <div className="min-h-screen bg-background ">
      <Header />

      {/* SHOW LOGGED USER */}
      <UserWelcome />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-linear-to-br from-background via-background to-card overflow-hidden flex items-center">
        {/* Animated gradient orbs background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float opacity-30" />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float opacity-30"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float opacity-20"
          style={{ animationDelay: "4s" }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-4">
                {/* Decorative accent line */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-linear-to-r from-primary to-transparent rounded-full" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                    Welcome to Excellence
                  </span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
                  Find Your Perfect Drive
                </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Discover our curated selection of premium vehicles. Expert
                guidance, transparent pricing, and seamless booking all in one
                place.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-lg"
                >
                  <Link href="/vehicles">Explore Vehicles</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary/40 text-primary hover:bg-primary/10 font-semibold px-8 py-6 text-lg rounded-lg bg-transparent"
                >
                  <Link href="/consultation">Book An Appointment</Link>
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/40">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">30+</p>
                  <p className="text-sm text-muted-foreground">
                    Vehicles Available
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">95%</p>
                  <p className="text-sm text-muted-foreground">
                    Customer Satisfaction
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-muted-foreground">
                    Expert Support
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Showroom Image */}
            <div className="relative h-[500px] animate-slide-in-right">
              <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-primary/20 rounded-2xl blur-3xl opacity-60" />
              <div className="relative h-full rounded-2xl border-2 border-primary/30 overflow-hidden shadow-2xlgroup hover-glow transition-shadow duration-300">
                <Image
                  src="/showroom-exterior1.jpeg"
                  alt="Premium Auto Showroom"
                  fill
                  className="object-cover group-hover:scale-[105] transition-transform duration-500"
                  priority
                />
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Premium Selection
                  </h3>
                  <p className="text-white/90">
                    Handpicked vehicles inspected for quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex items-center justify-between my-10">
          <div>
            <h2 className="text-4xl font-bold mb-2">Featured Vehicles</h2>
            <p className="text-muted-foreground text-lg">
              Handpicked selection from our premium inventory
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            size="lg"
            className="hidden md:flex bg-transparent"
          >
            <Link href="/vehicles">
              View All <ChevronRight size={18} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group
              hover-glow scale-in"
              style={{
                opacity: 0,
                animationDelay: `${index * 0.15}s`,
              }}
            >
              <div className="relative h-52 bg-muted overflow-hidden">
                <img
                  src={vehicle.images?.[0]|| "/placeholder.svg"}
                  alt={vehicle.brand}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-primary font-bold text-xl mb-3">
                    LKR {vehicle.price.toLocaleString()}
                </p>
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

      {/* Trust & Credibility Section + How it works     */}
      <Creditability />
      
      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 mb-24 mt-12">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>
        <TestimonialsCarousel />
      </section>

      {/* YT Reviews */}
      <section className="max-w-7xl mx-auto px-4 mb-24 mt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Video Reviews by Sameera Auto Traders
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Watch our detailed car reviews and technical insights
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            size="lg"
            className="self-start md:self-auto bg-transparent"
          >
            <a
              href="https://www.youtube.com/@SAMEERAAUTOENTERTAINMENT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5 fill-primary" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Visit Channel
            </a>
          </Button>
        </div>

        {/* Featured Video */}
        {videoReviews.length > 0 ? (
          <>
            <div className="rounded-md">
              <h3 className="text-2xl font-bold mb-4">Latest Review</h3>
              <a href={`https://www.youtube.com/watch?v=${videoReviews[0].youtubeId}`} target="_blank" rel="noopener noreferrer"
                className="relative rounded-xl overflow-hidden border border-border hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group cursor-pointer hover-glow fade-in-up">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${videoReviews[0].youtubeId}/maxresdefault.jpg`}
                    alt={videoReviews[0].title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play
                        className="text-white fill-white ml-1"
                        size={28}
                      />
                    </div>
                  </div>
                  <Badge className="absolute bottom-3 right-3 px-3 py-1 bg-primary text-white text-xs rounded-md font-semibold flex items-center gap-1">
                    <svg
                      className="w-3 h-3 fill-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3
                      .015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </Badge>
                </div>
                
              </a>
              <div className="p-5">
                <h3 className="font-bold text-2xl mb-2 group-hover:text-primary transition-colors leading-snug">
                  {videoReviews[0].title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {videoReviews[0].description}
                </p>
              </div>
            </div>
            {/* Video Grid - Remaining videos */}
            {videoReviews.length > 1 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">More Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoReviews.slice(1,4).map((video, index) => (

                    <VideoReviews video={video} index={index} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Fallback if no videos are found */
          <div className="text-center py-10 text-muted-foreground">
            No reviews available at the moment.
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
        <div className="bg-linear-to-br from-primary via-primary to-accent rounded-2xl p-10 md:p-12 text-center text-primary-foreground shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-linear(circle_at_top_right,var(--tw-linear-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Get Updates on New Stock & Offers
            </h2>
            <p className="text-lg mb-8 opacity-95 text-balance max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive deals and new vehicle
              arrivals.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
      <Footer />
      <FeedbackPopup />
    </div>
  );
}
