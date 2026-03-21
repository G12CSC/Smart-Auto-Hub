"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CalendarIcon,
  Clock,
  MapPin,
  Car,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  LogOut,
  Settings,
  FileText,
  Bell,
} from "lucide-react";
import ChatBot from "@/components/ChatBot";
import { localStorageAPI } from "@/lib/storage/localStorage";
import { cancelBookings } from "@/app/APITriggers/cancelBookings.js";
import { rescheduleBooking } from "@/app/APITriggers/rescheduleBooking.js";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Appointment = {
  id: string | number;
  consultationType?: string;
  status?: string;
  preferredDate?: string;
  preferredTime?: string;
  branch?: string;
  vehicleType?: string;
  adminMessage?: string;
  advisorMessage?: string;
  message?: string;
};

type Review = {
  id: string | number;
  vehicle: string;
  date: string;
  rating: number;
  comment: string;
  location: string;
};

type DashboardNotifications = {
  appointments: number;
  reviews: number;
};

type DashboardClientProps = {
  session: Session | null;
  initialUpcoming: Appointment[];
  initialHistory: Appointment[];
};

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type UserNotification = {
  emailForAppointments: boolean;
  emailForPromotions: boolean;
  smsRemainers: boolean;
};

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export default function DashboardClient({
  session,
  initialUpcoming,
  initialHistory,
}: DashboardClientProps) {

  const { data: liveSession, update: updateSession } = useSession();
  const displaySession = liveSession ?? session;
  const [activeTab, setActiveTab] = useState("appointments");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >(Array.isArray(initialUpcoming) ? initialUpcoming : []);
  const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>(
    Array.isArray(initialHistory) ? initialHistory : [],
  );

  const [userReviews] = useState<Review[]>([]);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [changePasswordData, setChangePasswordData] =
    useState<ChangePasswordData>({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

  const [manageNotifications, setManageNotifications] = useState(false);
  const [userNotifications, setUserNotifications] = useState<UserNotification>({
    emailForAppointments:
      localStorage.getItem("emailForAppointments") === "true",
    emailForPromotions: localStorage.getItem("emailForPromotions") === "true",
    smsRemainers: localStorage.getItem("smsRemainers") === "true",
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    setUpcomingAppointments(
      Array.isArray(initialUpcoming) ? initialUpcoming : [],
    );
    setAppointmentHistory(Array.isArray(initialHistory) ? initialHistory : []);
  }, [initialUpcoming, initialHistory]);

  const [notifications, setNotifications] = useState<DashboardNotifications>({
    appointments: 0,
    reviews: 0,
  });

  useEffect(() => {
    const notifs = localStorageAPI.getNotifications();
    setNotifications(notifs.dashboard);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    if (tabId === "appointments") {
      localStorageAPI.clearNotification("dashboard", "appointments");
    } else if (tabId === "reviews") {
      localStorageAPI.clearNotification("dashboard", "reviews");
    }

    const notifs = localStorageAPI.getNotifications();
    setNotifications(notifs.dashboard);
  };

  const fetchUserProfileDetails = useCallback(async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        toast.success("User profile details fetched successfully");

        if (data.success) {
          setUserProfile(data.data);
          toast.success("User profile details set successfully");
        }
      } else {
        toast.error("Failed to fetch user profile details");
      }
    } catch (error) {
      console.error("Error fetching user profile details:", error);
      toast.error("An error occurred while fetching user profile details");
    }
  }, []);

  useEffect(() => {
    if (activeTab === "profile" && !userProfile) {
      fetchUserProfileDetails();
    }
  }, [activeTab, userProfile, fetchUserProfileDetails]);

  const changeUserPasswords = async () => {
    try {
      if (
        changePasswordData.newPassword !== changePasswordData.confirmNewPassword
      ) {
        toast.error("New passwords do not match");
        return;
      }

      const response = await fetch("/api/user/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changePasswordData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Password changed successfully");
        setChangePasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("An error occurred while changing the password");
    }
  };

  const handleUserAccountDeletion = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const password = prompt(
        "Please enter your password to confirm account deletion:",
      );
      if (!password) {
        toast.error("Password is required to delete account");
        return;
      }
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        toast.success("Account deleted successfully");
        signOut({ callbackUrl: "/login" });
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting the account");
    }
  };

  const handleSaveProfileChanges = async () => {
    if (!userProfile) {
      toast.error("Profile data is not loaded yet");
      return;
    }

    try {
      console.log("Saving profile changes:", userProfile);

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });

      const data = await res.json();

      if (data.success) {
        setUserProfile(data.data);

        await updateSession({
          name: data.data?.name,
        });

        toast.success("Profile updated successfully");
        setIsEditingProfile(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile changes:", error);
      toast.error("An error occurred while saving profile changes");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Welcome Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-slide-in-down">
          <div className="flex items-center gap-4">
            {/* <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {session?.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </div> */}
            <Avatar className="h-16 w-16">
              <AvatarImage src={displaySession?.user?.image || undefined} />
              <AvatarFallback>
                {displaySession?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold animate-text-reveal">
                Welcome back, {displaySession?.user?.name || "User"}!
              </h1>

              <p className="text-muted-foreground animate-text-reveal stagger-1">
                Manage your appointments and profile
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <nav className="rounded-lg border border-border overflow-hidden sticky top-28 p-2">
              <div className="divide-y divide-border mb-4">
                {[
                  {
                    label: "My Appointments",
                    id: "appointments",
                    icon: Calendar,
                    count: notifications.appointments,
                  },
                  {
                    label: "My Reviews",
                    id: "reviews",
                    icon: Star,
                    count: notifications.reviews,
                  },
                  {
                    label: "My Profile",
                    id: "profile",
                    icon: User,
                    count: 0,
                  },
                  {
                    label: "Settings",
                    id: "settings",
                    icon: Settings,
                    count: 0,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    //onClick={() => setActiveTab(item.id)}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-4 font-medium transition relative rounded-lg my-2 bg-card ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                    {item.count > 0 && (
                      <span className="ml-auto h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-pulse">
                        {item.count > 9 ? "9+" : item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <Button
                className="w-full my-4 bg-transparent"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 animate-slide-in-right delay-200">
            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">My Appointments</h2>
                  <Button asChild>
                    <Link href="/consultation">
                      <Calendar size={18} className="mr-2" />
                      Book New Appointment
                    </Link>
                  </Button>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-primary" />
                    Upcoming Appointments
                  </h3>

                  {upcomingAppointments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No upcoming appointments.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition"
                        >
                          <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-lg">
                                    {apt.consultationType}
                                  </p>
                                </div>

                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                                    apt.status === "ACCEPTED"
                                      ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                                      : "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CalendarIcon
                                    size={16}
                                    className="text-primary"
                                  />
                                  <span>{apt.preferredDate}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock size={16} className="text-primary" />
                                  <span>{apt.preferredTime}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin size={16} className="text-primary" />
                                  <span>{apt.branch}</span>
                                </div>

                                {apt.vehicleType && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Car size={16} className="text-primary" />
                                    <span>{apt.vehicleType}</span>
                                  </div>
                                )}
                              </div>

                              {/* âœ… ADMIN MESSAGE (OPTIONAL) */}
                              {apt.adminMessage && (
                                <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare
                                      size={14}
                                      className="text-blue-600"
                                    />
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                      Message from Admin
                                    </p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {apt.adminMessage}
                                  </p>
                                </div>
                              )}

                              {apt.message && (
                                <div className="mt-4 p-3 bg-secondary/30 rounded text-sm">
                                  <p className="font-medium text-xs text-muted-foreground mb-1">
                                    Notes:
                                  </p>
                                  <p>{apt.message}</p>
                                </div>
                              )}
                              {apt.advisorMessage && (
                                <div className="mt-4 p-3 bg-green-500/10 rounded text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare
                                      size={14}
                                      className="text-green-600"
                                    />
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                      Message from Advisor
                                    </p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {apt.advisorMessage}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                            {apt.status === "PENDING" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={apt.status !== "PENDING"}
                                onClick={() => {
                                  setNewDate(
                                    apt.preferredDate
                                      ? new Date(apt.preferredDate)
                                          .toISOString()
                                          .split("T")[0]
                                      : "",
                                  );
                                  setNewTime(apt.preferredTime || "");
                                  setRescheduleApt(apt);
                                  setRescheduleOpen(true);
                                }}
                              >
                                <Edit size={14} className="mr-2" />
                                Reschedule
                              </Button>
                            )}

                            {rescheduleOpen && (
                              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                <div className="bg-card p-6 rounded-lg w-full max-w-sm">
                                  <h3 className="text-lg font-bold mb-4">
                                    Reschedule Appointment
                                  </h3>

                                  <div className="space-y-3">
                                    <Input
                                      type="date"
                                      value={newDate}
                                      onChange={(e) =>
                                        setNewDate(e.target.value)
                                      }
                                    />

                                    <select
                                      aria-label="Reschedule time slot"
                                      className="w-full border border-border rounded px-3 py-2 dark:bg-secondary/90 dark:border-secondary/50"
                                      value={newTime}
                                      onChange={(e) =>
                                        setNewTime(e.target.value)
                                      }
                                    >
                                      <option value="">
                                        Select a time slot
                                      </option>
                                      <option value="09:00-10:00">
                                        09:00 - 10:00 AM
                                      </option>
                                      <option value="10:00-11:00">
                                        10:00 - 11:00 AM
                                      </option>
                                      <option value="11:00-12:00">
                                        11:00 - 12:00 PM
                                      </option>
                                      <option value="14:00-15:00">
                                        02:00 - 03:00 PM
                                      </option>
                                      <option value="15:00-16:00">
                                        03:00 - 04:00 PM
                                      </option>
                                      <option value="16:00-17:00">
                                        04:00 - 05:00 PM
                                      </option>
                                    </select>
                                  </div>

                                  <div className="flex justify-end gap-3 mt-5">
                                    <Button
                                      variant="outline"
                                      onClick={() => setRescheduleOpen(false)}
                                    >
                                      Cancel
                                    </Button>

                                    <Button
                                      onClick={async () => {
                                        try {
                                          if (!rescheduleApt) return;
                                          const updated =
                                            await rescheduleBooking(
                                              rescheduleApt.id,
                                              newDate,
                                              newTime,
                                            );

                                          // Update UI instantly
                                          setUpcomingAppointments((prev) =>
                                            prev.map((a) =>
                                              a.id === updated.id ? updated : a,
                                            ),
                                          );

                                          setRescheduleOpen(false);
                                        } catch {
                                          alert("Reschedule failed");
                                        }
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={apt.status !== "ACCEPTED"}
                              className="text-red-600 hover:text-red-700 bg-transparent cursor-pointer hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:text-muted-foreground disabled:hover:bg-transparent disabled:cursor-not-allowed"
                            >
                              <MessageSquare size={14} className="mr-2" />
                              Contact
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={apt.status !== "PENDING"}
                              className="text-red-600 hover:text-red-700 bg-transparent cursor-pointer hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:text-muted-foreground disabled:hover:bg-transparent disabled:cursor-not-allowed"
                              onClick={async () => {
                                try {
                                  const cancelled = await cancelBookings(
                                    apt.id,
                                  );

                                  // Remove from upcoming
                                  setUpcomingAppointments((prev) =>
                                    prev.filter((a) => a.id !== apt.id),
                                  );

                                  // Add to history
                                  setAppointmentHistory((prev) => [
                                    cancelled,
                                    ...prev,
                                  ]);
                                } catch (err) {
                                  alert("Failed to cancel appointment");
                                }
                              }}
                            >
                              <XCircle size={14} className="mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Appointment History */}
                <div className="mt-12">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Appointment History
                  </h3>

                  {appointmentHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No completed appointments.
                    </p>
                  ) : (
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-secondary/30">
                            <th className="px-6 py-3 text-left font-semibold text-sm">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-sm">
                              Vehicle
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-sm">
                              Branch
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-sm">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-sm">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointmentHistory.map((apt) => (
                            <tr
                              key={apt.id}
                              className="border-b border-border hover:bg-secondary/20 transition"
                            >
                              <td className="px-6 py-3 text-sm font-medium">
                                {apt.consultationType}
                              </td>
                              <td className="px-6 py-3 text-sm">
                                {apt.vehicleType}
                              </td>
                              <td className="px-6 py-3 text-sm">{""}</td>
                              <td className="px-6 py-3 text-sm text-muted-foreground">
                                {apt.preferredDate}
                              </td>
                              <td className="px-6 py-3 text-sm">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-400 font-medium text-xs">
                                  {apt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Reviews</h2>
                  <Button onClick={() => setWriteReviewOpen(!writeReviewOpen)}>
                    <Star size={18} className="mr-2" />
                    {writeReviewOpen ? "Close Review Form" : "Write a Review"}
                  </Button>
                </div>
                {writeReviewOpen && (
                  <div className="bg-card rounded-lg border border-border p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">Write a Review</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Car size={16} />
                          Vehicle
                        </label>
                        <Input type="text" placeholder="e.g. Toyota Camry" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Star size={16} />
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="text-2xl"
                              >
                                <span
                                  className={
                                    (hover || rating) >= star
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                                  }
                                >
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm">
                            Coupon Code
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter coupon code"
                              value={coupon}
                              onChange={(e) => setCoupon(e.target.value)}
                              className="w-full border rounded px-3 py-2 dark:bg-secondary/90"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <MessageSquare size={16} />
                          Comment
                        </label>
                        <textarea
                          className="w-full border border-border rounded px-3 py-2 dark:bg-secondary/90 dark:border-secondary/50"
                          rows={4}
                          placeholder="Write your review here..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <Button>
                          <CheckCircle size={16} className="mr-2" />
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {userReviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    You haven't written any reviews yet.
                  </p>
                )}

                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-card rounded-lg border border-border p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{review.vehicle}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="fill-yellow-500 text-yellow-500"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-4">{review.comment}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit size={14} className="mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-card rounded-lg border border-border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Profile</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    {/* <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                      {session?.user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </div> */}
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={displaySession?.user?.image || undefined} />
                      <AvatarFallback>
                        {displaySession?.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditingProfile && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <User size={16} />
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={userProfile?.name || ""}
                        onChange={(e) => {
                          setUserProfile((prev) =>
                            prev ? { ...prev, name: e.target.value } : prev,
                          );
                        }}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={userProfile?.email || ""}
                        onChange={(e) => {
                          setUserProfile((prev) =>
                            prev ? { ...prev, email: e.target.value } : prev,
                          );
                        }}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Phone size={16} />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={userProfile?.phone || ""}
                        onChange={(e) => {
                          setUserProfile((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  phone: e.target.value || undefined,
                                }
                              : prev,
                          );
                        }}
                        disabled={!isEditingProfile}
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSaveProfileChanges}>
                        <CheckCircle size={18} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-card rounded-lg border border-border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold mb-6">Settings</h2>
                  {!manageNotifications ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mb-4"
                      onClick={() =>
                        setManageNotifications(!manageNotifications)
                      }
                    >
                      <Bell size={16} className="mr-2" />
                      Manage Notifications
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mb-4"
                      onClick={() =>
                        setManageNotifications(!manageNotifications)
                      }
                    >
                      <Bell size={16} className="mr-2" />
                      Hide Notifications
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your notification preferences and account settings
                </p>
                <div className="space-y-6">
                  {manageNotifications && (
                    <div>
                      <h3 className="font-semibold mb-4">
                        Notification Preferences
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={userNotifications.emailForAppointments}
                            onChange={(e) => {
                              const updated = {
                                ...userNotifications,
                                emailForAppointments: e.target.checked,
                              };
                              setUserNotifications(updated);
                              localStorage.setItem(
                                "emailForAppointments",
                                e.target.checked.toString(),
                              );
                            }}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">
                            Email notifications for appointments
                          </span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={userNotifications.emailForPromotions}
                            onChange={(e) => {
                              const updated = {
                                ...userNotifications,
                                emailForPromotions: e.target.checked,
                              };
                              setUserNotifications(updated);
                              localStorage.setItem(
                                "emailForPromotions",
                                e.target.checked.toString(),
                              );
                            }}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">
                            Newsletter and promotional emails
                          </span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={userNotifications.smsRemainers}
                            onChange={(e) => {
                              const updated = {
                                ...userNotifications,
                                smsRemainers: e.target.checked,
                              };
                              setUserNotifications(updated);
                              localStorage.setItem(
                                "smsRemainers",
                                e.target.checked.toString(),
                              );
                            }}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">SMS reminders</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold mb-4">Change Password</h3>
                    <div className="w-full mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded">
                      If you are{" "}
                      <span className="font-bold text-green-400">
                        Google-Auth
                      </span>{" "}
                      user, you cannot change your password here. Please visit{" "}
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Account Security
                      </a>{" "}
                      to manage your password and security settings.
                    </div>
                    <div className="space-y-4 max-w-md">
                      <Input
                        type="password"
                        placeholder="Current Password"
                        value={changePasswordData.currentPassword}
                        onChange={(e) =>
                          setChangePasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="password"
                        placeholder="New Password"
                        value={changePasswordData.newPassword}
                        onChange={(e) =>
                          setChangePasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={changePasswordData.confirmNewPassword}
                        onChange={(e) =>
                          setChangePasswordData((prev) => ({
                            ...prev,
                            confirmNewPassword: e.target.value,
                          }))
                        }
                      />
                      <Button
                        onClick={() => {
                          changeUserPasswords();
                        }}
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold mb-2 text-red-600">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                      onClick={() => {
                        handleUserAccountDeletion();
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot Icon */}
      <ChatBot />
    </>
  );
}
