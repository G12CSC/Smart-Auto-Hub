"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Users, Car, Calendar, Mail, TrendingUp, MapPin, CheckCircle, XCircle, Clock, FileText, Video, ExternalLink } from 'lucide-react'
import NewsletterTable from "./NewsletterTable";
import ChatBot from "@/components/ChatBot"
import {approveBookings, updateBookings} from "../APITriggers/approveBookingsByAdmins.js";
import {sendAdminMessagesForBookings} from "../APITriggers/sendAdminMessagesForBookings.js";

const stats = [
  { 
    label: "Total Vehicles", 
    value: "150", 
    change: "+12 this month",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: Car
  },
  { 
    label: "Pending Requests", 
    value: "23", 
    change: "8 appointments, 15 inquiries",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    icon: Clock
  },
  { 
    label: "Newsletter Subscribers", 
    value: "1,247", 
    change: "+89 this week",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    icon: Mail
  },
  { 
    label: "Active Branches", 
    value: "3", 
    change: "Nugegoda, Matara, Colombo",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: MapPin
  },
]

const recentRequests = [
]

const vehicles = [
  {
    id: 1,
    name: "Toyota Prius 2022",
    branch: "Nugegoda",
    status: "Available",
    price: "LKR 7,500,000",
    views: 234,
  },
  {
    id: 2,
    name: "Honda Vezel 2021",
    branch: "Matara",
    status: "Shipped",
    price: "LKR 8,200,000",
    views: 189,
  },
  {
    id: 3,
    name: "Suzuki Swift 2023",
    branch: "Colombo",
    status: "Available",
    price: "LKR 4,900,000",
    views: 312,
  },
]

const newsletterSubscribers = [
]

const videoReviews = [
  {
    id: 1,
    title: "2022 Toyota Prius Full Review - Is It Worth The Money?",
    description:
      "Detailed walkthrough of the 2022 Toyota Prius including exterior, interior, features, and driving experience.",
    videoId: "dQw4w9WgXcQ",
    uploadDate: "14/11/2025",
    views: "12.5K",
  },
  {
    id: 2,
    title: "Honda Civic 2021 - Complete Technical Review",
    description:
      "In-depth technical analysis of the Honda Civic 2021 model, covering engine performance and safety features.",
    videoId: "dQw4w9WgXcQ",
    uploadDate: "10/11/2025",
    views: "8.3K",
  },
  {
    id: 3,
    title: "Suzuki Swift 2023 - Best Value for Money?",
    description: "Comprehensive review of the Suzuki Swift 2023, discussing its pros and cons for Sri Lankan buyers.",
    videoId: "dQw4w9WgXcQ",
    uploadDate: "08/11/2025",
    views: "15.2K",
  },
]

export default function AdminPage() {

  const [activeTab, setActiveTab] = useState("requests")
  const [searchQuery, setSearchQuery] = useState("")
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
  });

    const [recentRequests, setRecentRequests] = useState([]);

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/Consultations/getBooking");
            const data = await res.json();
            setRecentRequests(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    useEffect(() => {

        fetchBookings();

        // ✅ Polling every 5 seconds
        const interval = setInterval(fetchBookings, 5000);
        return () => clearInterval(interval);
    }, []);


    return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage Smart AutoHub operations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="font-semibold">admin@smartautohub.lk</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              A
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-card rounded-t-lg border-x border-t border-border">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border overflow-x-auto">
            {[
              { id: "requests", label: "Consultation Bookings", icon: Users },
              { id: "vehicles", label: "Vehicle Management", icon: Car },
              { id: "videos", label: "Video Reviews", icon: Video},
              { id: "newsletter", label: "Newsletter", icon: Mail },
              { id: "branches", label: "Branch Inventory", icon: MapPin },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
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

        {/* Tab Content */}
        <div className="bg-card rounded-b-lg border-x border-b border-border p-6">
          {/* Customer Requests Tab */}
          {activeTab === "requests" && (
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold">Consultation Bookings</h2>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter size={18} />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-semibold text-sm">Customer</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Contact Details</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Booking Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Vehicle Details</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>

                    <tbody>
                    {recentRequests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.fullName}</td>
                            <td>{request.email}</td>
                            <td>{request.consultationType}</td>
                            <td>{request.vehicleType}</td>
                            <td>{request.preferredDate}</td>
                            <td>{request.preferredTime}</td>
                            <td className="px-4 py-2">
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                request.status === "APPROVED"
                    ? "bg-green-500/20 text-green-700"
                    : request.status === "REJECTED"
                        ? "bg-red-500/20 text-red-700"
                        : "bg-yellow-500/20 text-yellow-700"
            }`}
        >
          {request.status}
        </span>
                            </td>
                            <td className="px-4 py-2 flex gap-2">

                                {request.status === "PENDING" && (
                                    <>
                                        <button
                                            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                            onClick={() => approveBookings(request.id, "ACCEPTED")}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                                            onClick={() =>approveBookings(request.id, "REJECTED")}
                                        >
                                            Decline
                                        </button>
                                    </>
                                )}
                                <button
                                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                    onClick={() => sendAdminMessagesForBookings(request.id)}
                                >
                                    Send Message
                                </button>
                            </td>

                        </tr>
                    ))}
                    </tbody>

                </table>
              </div>
            </div>
          )}

          {/* Vehicle Management Tab */}
          {activeTab === "vehicles" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Vehicle Management</h2>
                <Button>
                  <Plus size={18} className="mr-2" />
                  Add New Vehicle
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-24 bg-secondary rounded flex items-center justify-center">
                        <Car size={32} className="text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {vehicle.branch}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {vehicle.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-lg">{vehicle.price}</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            vehicle.status === "Available"
                              ? "bg-green-500/20 text-green-700"
                              : "bg-orange-500/20 text-orange-700"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye size={16} />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Reviews Management Tab */}
          {activeTab === "videos" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Video Reviews Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage YouTube video reviews displayed on homepage
                  </p>
                </div>
              </div>

              {/* Add New Video Form */}
              <div className="bg-secondary/30 rounded-lg border border-border p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Add New Video Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Video Title</label>
                    <Input
                      placeholder="e.g., 2023 Toyota Camry Full Review"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full px-4 py-2 rounded bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                      placeholder="Brief description of the video content..."
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube Video ID</label>
                    <Input
                      placeholder="e.g., dQw4w9WgXcQ"
                      value={newVideo.videoId}
                      onChange={(e) => setNewVideo({ ...newVideo, videoId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Find this in the YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong>
                    </p>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">
                      <Plus size={18} className="mr-2" />
                      Add Video
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing Videos List */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Published Videos ({videoReviews.length})</h3>
                {videoReviews.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-secondary/30 transition"
                  >
                    <div className="relative h-24 w-40 flex-shrink-0 bg-secondary rounded overflow-hidden group">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Video size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-base mb-1">{video.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Uploaded: {video.uploadDate}</span>
                        <span>{video.views} views</span>
                        <span>ID: {video.videoId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")}
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Tab */}
          {activeTab === "newsletter" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage your email subscriber list</p>
                </div>
                <Button>
                  <FileText size={18} className="mr-2" />
                  Export List
                </Button>
              </div>

              <div>
                  <NewsletterTable/>
              </div>
            </div>
          )}

          {/* Branch Inventory Tab */}
          {activeTab === "branches" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Branch-wise Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Nugegoda", "Matara", "Colombo"].map((branch, idx) => (
                  <div key={idx} className="bg-secondary/30 rounded-lg border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{branch}</h3>
                        <p className="text-sm text-muted-foreground">Branch</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Vehicles</span>
                        <span className="font-bold text-lg">{45 + idx * 10}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Available</span>
                        <span className="font-semibold text-green-600">{30 + idx * 5}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Shipped</span>
                        <span className="font-semibold text-orange-600">{10 + idx * 3}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Reserved</span>
                        <span className="font-semibold text-blue-600">{5 + idx * 2}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatBot />
      <Footer />
    </div>
  )
}
