"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, CalendarIcon, Clock, MapPin, Car, User, Mail, Phone, Edit, Trash2, CheckCircle, XCircle, Star, MessageSquare, LogOut, Settings, FileText } from 'lucide-react'

const upcomingAppointments = [
  {
    id: 1,
    type: "Technical Consultation",
    consultant: "Mr. K R Wijeweera",
    branch: "Head Office - Nugegoda",
    date: "November 18, 2025",
    time: "10:30 AM",
    status: "Confirmed",
    vehicle: null,
    notes: "General vehicle consultation and financing options",
  },
  {
    id: 2,
    type: "Vehicle Viewing",
    consultant: "Sales Team",
    branch: "Nugegoda Branch",
    date: "November 20, 2025",
    time: "2:00 PM",
    status: "Pending",
    vehicle: "2022 Honda Vezel",
    notes: "Interested in test drive and trade-in options",
  },
  {
    id: 3,
    type: "Test Drive",
    consultant: "Mr. Sameera",
    branch: "Matara Branch",
    date: "November 22, 2025",
    time: "11:00 AM",
    status: "Confirmed",
    vehicle: "2023 Toyota Aqua",
    notes: "Scheduled test drive on highway and city roads",
  },
]

const appointmentHistory = [
  {
    id: 1,
    type: "Vehicle Viewing",
    date: "November 10, 2025",
    status: "Completed",
    vehicle: "2021 Toyota Prius",
    rating: 5,
    branch: "Nugegoda",
  },
  {
    id: 2,
    type: "Technical Consultation",
    date: "October 25, 2025",
    status: "Completed",
    vehicle: null,
    rating: 4,
    branch: "Colombo",
  },
  {
    id: 3,
    type: "Test Drive",
    date: "October 15, 2025",
    status: "Completed",
    vehicle: "2022 Suzuki Swift",
    rating: 5,
    branch: "Matara",
  },
]

const userReviews = [
  {
    id: 1,
    vehicle: "2021 Toyota Prius",
    rating: 5,
    comment: "Excellent service and very professional staff. Highly recommended!",
    date: "November 11, 2025",
  },
  {
    id: 2,
    vehicle: "General Consultation",
    rating: 4,
    comment: "Very helpful consultation regarding financing options.",
    date: "October 26, 2025",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("appointments")
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Welcome Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              JD
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, John!</h1>
              <p className="text-muted-foreground">Manage your appointments and profile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
              <div className="divide-y divide-border">
                {[
                  { label: "My Appointments", id: "appointments", icon: Calendar },
                  { label: "My Reviews", id: "reviews", icon: Star },
                  { label: "My Profile", id: "profile", icon: User },
                  { label: "Settings", id: "settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-4 font-medium transition ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            <Button className="w-full mt-4" variant="outline">
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>

          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
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
                  <div className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition">
                        <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-lg">{apt.type}</p>
                                <p className="text-sm text-muted-foreground">With: {apt.consultant}</p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                                  apt.status === "Confirmed"
                                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                    : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                }`}
                              >
                                {apt.status === "Confirmed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {apt.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon size={16} className="text-primary" />
                                <span>{apt.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock size={16} className="text-primary" />
                                <span>{apt.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin size={16} className="text-primary" />
                                <span>{apt.branch}</span>
                              </div>
                              {apt.vehicle && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Car size={16} className="text-primary" />
                                  <span>{apt.vehicle}</span>
                                </div>
                              )}
                            </div>

                            {apt.notes && (
                              <div className="mt-4 p-3 bg-secondary/30 rounded text-sm">
                                <p className="font-medium text-xs text-muted-foreground mb-1">Notes:</p>
                                <p>{apt.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                          <Button variant="outline" size="sm">
                            <Edit size={14} className="mr-2" />
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare size={14} className="mr-2" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <XCircle size={14} className="mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appointment History */}
                <div className="mt-12">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Appointment History
                  </h3>
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="px-6 py-3 text-left font-semibold text-sm">Type</th>
                          <th className="px-6 py-3 text-left font-semibold text-sm">Vehicle</th>
                          <th className="px-6 py-3 text-left font-semibold text-sm">Branch</th>
                          <th className="px-6 py-3 text-left font-semibold text-sm">Date</th>
                          <th className="px-6 py-3 text-left font-semibold text-sm">Rating</th>
                          <th className="px-6 py-3 text-left font-semibold text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointmentHistory.map((apt) => (
                          <tr key={apt.id} className="border-b border-border hover:bg-secondary/20 transition">
                            <td className="px-6 py-3 text-sm font-medium">{apt.type}</td>
                            <td className="px-6 py-3 text-sm">{apt.vehicle || "-"}</td>
                            <td className="px-6 py-3 text-sm">{apt.branch}</td>
                            <td className="px-6 py-3 text-sm text-muted-foreground">{apt.date}</td>
                            <td className="px-6 py-3 text-sm">
                              <div className="flex items-center gap-1">
                                {[...Array(apt.rating)].map((_, i) => (
                                  <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                                ))}
                              </div>
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
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Reviews</h2>
                  <Button>
                    <Star size={18} className="mr-2" />
                    Write Review
                  </Button>
                </div>

                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <div key={review.id} className="bg-card rounded-lg border border-border p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{review.vehicle}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
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
                    <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                      JD
                    </div>
                    {isEditingProfile && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <User size={16} />
                        Full Name
                      </label>
                      <Input
                        type="text"
                        defaultValue="John Doe"
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        defaultValue="john.doe@example.com"
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <Phone size={16} />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        defaultValue="+94 77 123 4567"
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                        <MapPin size={16} />
                        City
                      </label>
                      <Input
                        type="text"
                        defaultValue="Colombo"
                        disabled={!isEditingProfile}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      Address
                    </label>
                    <Textarea
                      defaultValue="123 Main Street, Colombo 03, Sri Lanka"
                      disabled={!isEditingProfile}
                      rows={3}
                    />
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-3 pt-4">
                      <Button>
                        <CheckCircle size={18} className="mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-card rounded-lg border border-border p-8">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="text-sm">Email notifications for appointments</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="text-sm">Newsletter and promotional emails</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="h-4 w-4" />
                        <span className="text-sm">SMS reminders</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <Input type="password" placeholder="Current Password" />
                      <Input type="password" placeholder="New Password" />
                      <Input type="password" placeholder="Confirm New Password" />
                      <Button>Update Password</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold mb-2 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
