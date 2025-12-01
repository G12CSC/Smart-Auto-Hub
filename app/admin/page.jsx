"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Users, Car, Calendar, Mail, TrendingUp, MapPin, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import NewsletterTable from "./NewsletterTable";

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
  {
    id: 1,
    customer: "P. K. Dilhara",
    email: "dilhara@example.com",
    phone: "077 123 4567",
    vehicle: "2021 Wagon R",
    branch: "Nugegoda",
    type: "Vehicle Viewing",
    date: "14/11/2025",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: 2,
    customer: "S. A. Samaraweera",
    email: "samaraweera@example.com",
    phone: "077 234 5678",
    vehicle: "-",
    branch: "-",
    type: "Technical Consultation",
    date: "15/11/2025",
    time: "2:30 PM",
    status: "Pending",
  },
  {
    id: 3,
    customer: "A. A. Chethiya",
    email: "chethiya@example.com",
    phone: "077 345 6789",
    vehicle: "2022 Prius",
    branch: "Matara",
    type: "Vehicle Viewing",
    date: "16/11/2025",
    time: "11:00 AM",
    status: "Confirmed",
  },
  {
    id: 4,
    customer: "K. K. Lakshan",
    email: "lakshan@example.com",
    phone: "077 456 7890",
    vehicle: "2023 Swift",
    branch: "Colombo",
    type: "Test Drive",
    date: "17/11/2025",
    time: "3:00 PM",
    status: "Confirmed",
  },
  {
    id: 5,
    customer: "H. K. Hissella",
    email: "hissella@example.com",
    phone: "077 567 8901",
    vehicle: "2020 Civic",
    branch: "Nugegoda",
    type: "Vehicle Viewing",
    date: "18/11/2025",
    time: "9:30 AM",
    status: "Cancelled",
  },
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
  {
    id: 1,
    email: "john.doe@example.com",
    subscribedDate: "10/11/2025",
    status: "Active",
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    subscribedDate: "12/11/2025",
    status: "Active",
  },
  {
    id: 3,
    email: "bob.wilson@example.com",
    subscribedDate: "13/11/2025",
    status: "Active",
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("requests")
  const [searchQuery, setSearchQuery] = useState("")

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
              { id: "requests", label: "Customer Requests", icon: Users },
              { id: "vehicles", label: "Vehicle Management", icon: Car },
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
                <h2 className="text-2xl font-bold">Customer Requests</h2>
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
                      <th className="px-4 py-3 text-left font-semibold text-sm">Contact</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Vehicle/Branch</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Date & Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="border-b border-border hover:bg-secondary/30 transition">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{request.customer}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="text-muted-foreground">{request.email}</p>
                            <p className="text-muted-foreground">{request.phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium">{request.type}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p>{request.vehicle}</p>
                            {request.branch !== "-" && (
                              <p className="text-muted-foreground text-xs">{request.branch}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p>{request.date}</p>
                            <p className="text-muted-foreground text-xs">{request.time}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                              request.status === "Pending"
                                ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                : request.status === "Confirmed"
                                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                : "bg-red-500/20 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {request.status === "Confirmed" && <CheckCircle size={12} />}
                            {request.status === "Cancelled" && <XCircle size={12} />}
                            {request.status === "Pending" && <Clock size={12} />}
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {request.status === "Pending" && (
                              <>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <CheckCircle size={14} className="mr-1" />
                                  Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <XCircle size={14} className="mr-1" />
                                  Decline
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye size={14} />
                            </Button>
                          </div>
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

      <Footer />
    </div>
  )
}
