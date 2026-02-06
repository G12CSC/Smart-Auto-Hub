"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdvisorHeader } from "@/components/AdvisorHeader";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  LogOut,
  User,
  BookOpen,
  Settings,
} from "lucide-react";


const advisorInfo = {
  name: "Sarah Anderson",
  email: "sarah.anderson@smartautohub.lk",
  phone: "+94 701234567",
  specialization: "Technical & Sales Consultation",
  experience: "5 years",
  rating: 4.8,
  totalBookings: 45,
  avatar: "SA",
};

interface Booking {
  id: string | number;
  customer: string;
  email: string;
  phone: string;
  type: string;
  vehicle: string;
  date: string;
  time: string;
  notes: string;
  status: string;
}

export default function AdvisorPage() {

  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Confirmed" | "Today">("All");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [contactMethod, setContactMethod] = useState("email");
  const [advisorBookings, setAdvisorBookings] = useState<Booking[]>([]);


  useEffect(() => {
    const fetchAdvisorBookings = async () => {
      try {
        const res = await fetch("/api/Consultations/advisorBookings");

        if (!res.ok) {
          console.error("API error:", res.status);
          setAdvisorBookings([]);
          return;
        }

        const data = await res.json();
        setAdvisorBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed:", err);
        setAdvisorBookings([]);
      }
    };

    fetchAdvisorBookings();
  }, []);



  const filteredBookings = Array.isArray(advisorBookings)
    ? advisorBookings.filter(
      (booking) =>
        booking.customer
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    : [];


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdvisorHeader />

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold animate-textReveal">
              Advisor Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-2 animate-textReveal delay-200">
              Manage your consultation bookings and client interactions
            </p>
          </div>
          <div className="flex items-center gap-3 animate-slideInRight delay-300">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Advisor</p>
              <p className="font-semibold">{advisorInfo.name}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {advisorInfo.avatar}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-card rounded-lg border border-border p-6 animate-bounceInScale"
            style={{ animationDelay: "0ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold">
                  {advisorInfo.totalBookings}
                </p>
              </div>
              <BookOpen className="text-primary" size={32} />
            </div>
          </div>
          <div
            className="bg-card rounded-lg border border-border p-6 animate-bounceInScale"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Upcoming Bookings
                </p>
                <p className="text-3xl font-bold">
                  {
                    filteredBookings.filter((b) => b.status === "Confirmed")
                      .length
                  }
                </p>
              </div>
              <Calendar className="text-primary" size={32} />
            </div>
          </div>
          <div
            className="bg-card rounded-lg border border-border p-6 animate-bounceInScale"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rating</p>
                <p className="text-3xl font-bold">{advisorInfo.rating}</p>
              </div>
              <User className="text-primary" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-t-lg border-x border-t border-border animate-popIn delay-300">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border overflow-x-auto">
            {[
              { id: "bookings", label: "Bookings", icon: BookOpen },
              { id: "profile", label: "My Profile", icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition whitespace-nowrap ${activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-b-lg border-x border-b border-border p-6 animate-slideInUp delay-400">
          {activeTab === "bookings" && (
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold">Your Bookings</h2>
                <div className="relative flex-1 md:w-64">
                  <Input
                    placeholder="Search by customer name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(["All", "Pending", "Confirmed", "Today"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    className="rounded-full"
                    size="sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition animate-slideInLeft"
                      style={{
                        animationDelay: `${filteredBookings.indexOf(booking) * 50}ms`,
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="font-semibold text-lg">
                            {booking.customer}
                          </p>
                          <div className="text-sm text-muted-foreground mt-1">
                            <p className="flex items-center gap-2">
                              <Mail size={14} /> {booking.email}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone size={14} /> {booking.phone}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Type:</span>{" "}
                            {booking.type}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Vehicle:</span>{" "}
                            {booking.vehicle}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Date & Time:</span>{" "}
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {booking.notes}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${booking.status === "Confirmed"
                            ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                            : "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
                            }`}
                        >
                          <Clock size={12} />
                          {booking.status}
                        </span>
                        <Button size="sm" variant="outline">
                          <MessageCircle size={14} className="mr-1" />
                          Contact Customer
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No bookings found
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4">
                    {advisorInfo.avatar}
                  </div>
                  <h2 className="text-2xl font-bold">{advisorInfo.name}</h2>
                  <p className="text-muted-foreground">
                    {advisorInfo.specialization}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Experience
                      </p>
                      <p className="text-xl font-bold">
                        {advisorInfo.experience}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Rating
                      </p>
                      <p className="text-xl font-bold">
                        ⭐ {advisorInfo.rating}/5.0
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email
                      </p>
                      <p className="font-medium">{advisorInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="font-medium">{advisorInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings size={16} className="mr-2" />
                  Edit Profile
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to logout?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Logout</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
