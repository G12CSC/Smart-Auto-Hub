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
//import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { signOut } from "next-auth/react";
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
  Sun,
  Moon
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdvisorPage() {


  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [contactMethod, setContactMethod] = useState("email");
  const [advisorBookings, setAdvisorBookings] = useState([]);
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();


  const fetchProfile = async () => {
    const res = await fetch("/api/Advisors/profile")
    const data = await res.json()

    setAdvisorInfo(data)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (session?.user?.mustChangePassword) {
      router.push("/advisor-dashboard/changePassword");
    }
  }, [session]);


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


  useEffect(() => {
    fetchAdvisorBookings();
  }, []);

  const handleLogout = () => {
    signOut({
      callbackUrl: "/login"
    });
  };

  const updateProfile = async () => {

    const res = await fetch("/api/Advisors/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(advisorInfo),
    })

    if (res.ok) {
      toast.success("Profile updated")
      await fetchProfile()   // reload profile
      setOpenEdit(false)
    }
  }
  const filteredBookings = advisorBookings.filter(
    (booking) =>
      booking.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setAdvisorInfo({
        ...advisorInfo,
        avatar: reader.result
      });

    };

    reader.readAsDataURL(file);
  };

  const upcomingBookings = advisorBookings.filter((booking) => {
    if (booking.status === "REJECTED") return false;

    const bookingDate = new Date(booking.preferredDate);
    const today = new Date();

    return bookingDate >= today;
  });

  const handleContactCustomer = async (bookingId, email, phone) => {
    const message = prompt("Enter your message to the customer:");
    console.log("Booking ID:", bookingId);
    console.log("Customer Email:", email);
    console.log("Customer Phone:", phone);
    console.log("Message:", message);

    if (!message) return;

    try {
      const res = await fetch("/api/Consultations/contactCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, message, email, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send message ❌");
        return;
      }

      toast.success("Message sent successfully ✅");

    } catch (err) {
      toast.error("Failed to send message ❌");
      console.error(err);
    }
  };


  const handleDecision = async (bookingId, decision) => {
    const res = await fetch("/api/Consultations/advisorDecisions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, decision }),
    });

    if (!res.ok) {
      toast.error("Failed to update booking");
      return;
    }

    // ✅ UPDATE LOCAL STATE (this is what you were missing)
    setAdvisorBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: decision } : b
      )
    );

    toast.success(`Booking ${decision.toLowerCase()}`);
  };



  return (
    <div className="min-h-screen flex flex-col bg-background">


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
            <div>
              <button
                className="flex items-center gap-2 text-foreground hover:text-primary py-2 w-full text-left border rounded-md p-3 cursor-pointer transition-all"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Advisor</p>
              <p className="font-semibold">{advisorInfo?.name}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {advisorInfo?.avatar ? (
                <img
                  src={advisorInfo.avatar}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-primary flex items-center justify-center text-white text-2xl">
                  {advisorInfo?.name?.[0]}
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 text-white/80 py-2 cursor-pointer bg-red-600 p-2 rounded-md hover:text-white pl-2 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
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
                  {filteredBookings.length}
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
                    upcomingBookings.length
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
                <p className="text-3xl font-bold">{advisorInfo?.rating}</p>
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
                            {booking.fullName}
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
                            {booking.vehicleType}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Vehicle:</span>{" "}
                            {booking.vehicle}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Date & Time:</span>{" "}
                            {booking.preferredDate} at {booking.preferredTime}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {booking.message}
                      </p>
                      {
                        booking.advisorMessage && (
                          <>
                            <p className="text-sm text-primary mb-1">
                              <span className="font-medium">Your Message:</span>{" "}
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                              {booking.advisorMessage}
                            </p>
                          </>
                        )
                      }
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mt-3">
                          {booking.status === "FORWARDED" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleDecision(booking.id, "ACCEPTED")}
                              >
                                Accept
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDecision(booking.id, "REJECTED")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === "ACCEPTED"
                            ? "bg-emerald-500/20 text-emerald-700"
                            : booking.status === "REJECTED"
                              ? "bg-rose-500/20 text-rose-700"
                              : "bg-amber-500/20 text-amber-700"
                            }`}
                        >
                          {booking.status}
                        </span>

                        <Button size="sm" variant="outline" onClick={() => handleContactCustomer(booking.id, booking.email, booking.phone)}>
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
                    {advisorInfo?.avatar ? (
                      <img
                        src={advisorInfo.avatar}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary flex items-center justify-center text-white text-2xl">
                        {advisorInfo?.name?.[0]}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">{advisorInfo?.name}</h2>
                  <p className="text-muted-foreground">
                    {advisorInfo?.specialization}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Experience
                      </p>
                      <p className="text-xl font-bold">
                        {advisorInfo?.experience}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Rating
                      </p>
                      <p className="text-xl font-bold">
                        ⭐ {advisorInfo?.rating}/5.0
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email
                      </p>
                      <p className="font-medium">{advisorInfo?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="font-medium">{advisorInfo?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setOpenEdit(true)}>
                  <Settings size={16} className="mr-2" />
                  Edit Profile
                </Button>


                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
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

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

            <Input
                placeholder="User Name"
                value={advisorInfo?.name || ""}
                onChange={(e) =>
                    setAdvisorInfo({ ...advisorInfo, name: e.target.value })
                }
            />
          <Input
            placeholder="Phone"
            value={advisorInfo?.phone || ""}
            onChange={(e) =>
              setAdvisorInfo({ ...advisorInfo, phone: e.target.value })
            }
          />

          <Input
            placeholder="Specialization"
            value={advisorInfo?.specialization || ""}
            onChange={(e) =>
              setAdvisorInfo({ ...advisorInfo, specialization: e.target.value })
            }
          />

          <Input
            placeholder="Experience"
            value={advisorInfo?.experience || ""}
            onChange={(e) =>
              setAdvisorInfo({ ...advisorInfo, experience: e.target.value })
            }
          />

          <Input
            type="number"
            placeholder="Rating"
            value={advisorInfo?.rating || ""}
            onChange={(e) =>
              setAdvisorInfo({ ...advisorInfo, rating: Number(e.target.value) })
            }
          />

          <Input type="file" onChange={handleImageUpload} />

          <Button onClick={updateProfile}>
            Save Changes
          </Button>

        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
