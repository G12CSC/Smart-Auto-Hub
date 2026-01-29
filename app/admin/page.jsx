"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Car,
  Calendar,
  Mail,
  TrendingUp,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Video,
  ExternalLink,
  RefreshCcw,
  Plus,
  Info,
  UserX,
  FileUser,
  UserCog,
  Binoculars,
} from "lucide-react";

import NewsletterTable from "./NewsletterTable";
import ChatBot from "@/components/ChatBot";
import {
  approveBookings,
  updateBookings,
} from "../APITriggers/approveBookingsByAdmins.js";
import { sendAdminMessagesForBookings } from "../APITriggers/sendAdminMessagesForBookings.js";
import { localStorageAPI } from "@/lib/storage/localStorage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { BRANCHES } from "@/lib/branches";
import { vehicleAPI } from "@/lib/api/vehicles";
import { toast } from "sonner";

import {
  getVideoReviews,
  addVideoReview,
  deleteVideoReview,
} from "@/app/actions/videoActions";

import AdvisorSelectionModal from "@/components/advisor-selection-modal";

const stats = [
  {
    label: "Total Vehicles",
    value: "150",
    change: "+12 this month",
    color:
      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300",
    icon: Car,
  },
  {
    label: "Pending Requests",
    value: "23",
    change: "8 appointments, 15 inquiries",
    color:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    icon: Clock,
  },
  {
    label: "Newsletter Subscribers",
    value: "1,247",
    change: "+89 this week",
    color:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    icon: Mail,
  },
  {
    label: "Active Branches",
    value: "3",
    change: "Nugegoda, Matara, Colombo",
    color:
      "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    icon: MapPin,
  },
];

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
];

const newsletterSubscribers = [];

// const videoReviews = [
//   {
//     id: 1,
//     title: "2022 Toyota Prius Full Review - Is It Worth The Money?",
//     description:
//       "Detailed walkthrough of the 2022 Toyota Prius including exterior, interior, features, and driving experience.",
//     videoId: "dQw4w9WgXcQ",
//     uploadDate: "14/11/2025",
//     views: "12.5K",
//   },
//   {
//     id: 2,
//     title: "Honda Civic 2021 - Complete Technical Review",
//     description:
//       "In-depth technical analysis of the Honda Civic 2021 model, covering engine performance and safety features.",
//     videoId: "dQw4w9WgXcQ",
//     uploadDate: "10/11/2025",
//     views: "8.3K",
//   },
//   {
//     id: 3,
//     title: "Suzuki Swift 2023 - Best Value for Money?",
//     description:
//       "Comprehensive review of the Suzuki Swift 2023, discussing its pros and cons for Sri Lankan buyers.",
//     videoId: "dQw4w9WgXcQ",
//     uploadDate: "08/11/2025",
//     views: "15.2K",
//   },
// ];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterSubscribers, setNewsletterSubscribers] = useState(0);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
  });
  const [videoReviews, setVideoReviews] = useState([]);

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  
  // Modal states for View, Edit, Delete
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Branch Modal States
  const [isNugegodaOpen, setIsNugegodaOpen] = useState(false);
  const [isMataraOpen, setIsMataraOpen] = useState(false);
  const [isColomboOpen, setIsColomboOpen] = useState(false);

  const [recentRequests, setRecentRequests] = useState([]);
  const [adminVehicles, setAdminVehicles] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");

  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [selectedRequestForAdvisor, setSelectedRequestForAdvisor] =
    useState(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/Consultations/getAllBooking");
      const data = await res.json();
      setRecentRequests(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRefreshBookings = async () => {
    try {
      setIsRefreshing(true);
      await fetchBookings();
    } catch (error) {
      console.error("Failed to refresh bookings", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const result = await vehicleAPI.getAllVehicles();
    if (result.success) {
      const sortedVehicles = [...result.data].sort(
        (a, b) => Number(b.id) - Number(a.id),
      );
      setAdminVehicles(sortedVehicles);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const result = await getVideoReviews();
    if (result.success) {
      setVideoReviews(result.data);
    }
  };

  const handleVehicleFieldChange = (field, value) => {
    setVehicleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddVehicle = async (event) => {
    event.preventDefault();
    setIsSavingVehicle(true);
    setVehicleFormError("");

    if (
      !vehicleForm.companyName.trim() ||
      !vehicleForm.model.trim() ||
      !vehicleForm.year ||
      !vehicleForm.type.trim() ||
      !vehicleForm.mileage ||
      !vehicleForm.transmission.trim() ||
      !vehicleForm.fuelType.trim() ||
      !vehicleForm.branch ||
      !vehicleForm.price ||
      !vehicleForm.status
    ) {
      setVehicleFormError("Please fill in all required fields.");
      setIsSavingVehicle(false);
      return;
    }

    const images = vehicleForm.images
      .split(/,|\n/)
      .map((value) => value.trim())
      .filter(Boolean);

    const nameParts = [
      vehicleForm.year,
      vehicleForm.companyName,
      vehicleForm.model,
    ].filter(Boolean);
    const vehicleName = nameParts.join(" ");

    const newVehicle = {
      name: vehicleName,
      make: vehicleForm.companyName.trim(),
      model: vehicleForm.model.trim(),
      year: Number(vehicleForm.year),
      type: vehicleForm.type.trim(),
      mileage: Number(vehicleForm.mileage),
      transmission: vehicleForm.transmission.trim(),
      fuelType: vehicleForm.fuelType.trim(),
      location: vehicleForm.branch,
      price: Number(vehicleForm.price),
      status: vehicleForm.status,
      description: vehicleForm.description.trim(),
      images,
      views: 0,
    };

    const result = await vehicleAPI.addVehicle(newVehicle);
    if (result.success) {
      await loadVehicles();
      setVehicleForm(vehicleFormDefaults);
      setIsAddVehicleOpen(false);
    } else {
      setVehicleFormError(result.error || "Failed to add vehicle.");
    }

    setIsSavingVehicle(false);
  };

  const handleDeleteVehicle = (vehicleId) => {
    setDeleteVehicleId(null);
    toast.success("Vehicle Deleted Successfully");
  };

  const handleAddVideo = async () => {
    //Basic Validation
    if (!newVideo.title || !newVideo.videoId) {
      toast.error("Please fill in Title and VideoId");
      return;
    }

    //Call the server action
    const result = await addVideoReview(newVideo);

    if (result.success) {
      toast.success("Video Review added successfully");
      setNewVideo({ title: "", description: "", videoId: "" }); //Resets form
      loadVideos();
    } else {
      toast.error("Failed to add video");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const result = await deleteVideoReview(videoId);

    if (result.success) {
      toast.success("Video review removed from homepage");
      loadVideos(); //Refreshes the List
    } else {
      toast.error("Failed to remove the video");
    }
    setDeleteVideoId(null);
  };

  const [notifications, setNotifications] = useState({
    requests: 0,
    vehicles: 0,
    videos: 0,
    newsletter: 0,
  });

  useEffect(() => {
    const notifs = localStorageAPI.getNotifications();
    setNotifications(notifs.admin);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    if (tabId === "requests") {
      localStorageAPI.clearNotification("admin", "requests");
    } else if (tabId === "vehicles") {
      localStorageAPI.clearNotification("admin", "vehicles");
    } else if (tabId === "videos") {
      localStorageAPI.clearNotification("admin", "videos");
    } else if (tabId === "newsletter") {
      localStorageAPI.clearNotification("admin", "newsletter");
    }

    const notifs = localStorageAPI.getNotifications();
    setNotifications(notifs.admin);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 animate-text-reveal">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground animate-text-reveal stagger-1">
              Monitor and manage Smart AutoHub operations
            </p>
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
            <div
              key={idx}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition animate-pop-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold mb-2">
                {stat.label === "Newsletter Subscribers"
                  ? newsletterSubscribers
                  : stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-card rounded-t-lg border-x border-t border-border animate-pop-in delay-300">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border overflow-x-auto">
            {[
              {
                id: "requests",
                label: "Consultation Bookings",
                icon: Users,
                count: notifications.requests,
              },
              {
                id: "vehicles",
                label: "Vehicle Management",
                icon: Car,
                count: notifications.vehicles,
              },
              {
                id: "videos",
                label: "Video Reviews",
                icon: Video,
                count: notifications.videos,
              },
              {
                id: "newsletter",
                label: "Newsletter",
                icon: Mail,
                count: notifications.newsletter,
              },
              {
                id: "branches",
                label: "Branch Inventory",
                icon: MapPin,
                count: 0,
              },
            ].map((tab) => (
              <Button
                key={tab.id}
                // onClick={() => setActiveTab(tab.id)}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 hover:text-white rounded font-medium transition whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.count > 0 && (
                  <span className="h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-pulse">
                    {tab.count > 9 ? "9+" : tab.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-b-lg border-x border-b border-border p-6 slide-in-down delay-400">
          {/* Customer Requests Tab */}
          {activeTab === "requests" && (
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                {/* Title + Refresh */}
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">Consultation Bookings</h2>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefreshBookings}
                    disabled={isRefreshing}
                    title="Refresh bookings"
                  >
                    <RefreshCcw
                      size={18}
                      className={isRefreshing ? "animate-spin" : ""}
                    />
                  </Button>
                </div>

                {/* Search + Filter */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
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
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Contact Details
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Booking Type
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Vehicle Details
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id}>
                        <td>{request.fullName}</td>
                        <td>{request.email}</td>
                        <td>{request.consultationType}</td>
                        <td>{request.vehicleType}</td>
                        <td>{request.preferredDate.split("T")[0]}</td>
                        <td>{request.preferredTime}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === "ACCEPTED"
                                ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                                : request.status === "REJECTED"
                                  ? "bg-rose-500/20 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300"
                                  : request.status === "CANCELLED"
                                    ? "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300"
                                    : "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          {request.status === "PENDING" && (
                            <>
                              {/* <button
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                onClick={() =>
                                  approveBookings(request.id, "ACCEPTED")
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                                onClick={() =>
                                  approveBookings(request.id, "REJECTED")
                                }
                              >
                                Decline
                              </button> */}
                              <Button
                                size="sm"
                                className="text-xs bg-primary hover:bg-primary/90"
                                onClick={() => {
                                  setSelectedRequestForAdvisor(request);
                                  setIsAdvisorModalOpen(true);
                                }}
                              >
                                <Binoculars size={14} />
                                Send to an Advisor
                              </Button>
                            </>
                          )}

                          {/* Uncommet this for Custom dialog box for message input */}

                          {/* <Dialog>
                            <DialogTrigger asChild>
                              <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                Send Message
                              </button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Send an Admin Message</DialogTitle>
                                <DialogDescription>
                                  Enter the Admin Message for the booking
                                  request: {request.id}
                                </DialogDescription>
                              </DialogHeader>
                              <Input
                                placeholder="Message"
                                value={adminMessage}
                                onChange={(e) => setAdminMessage}
                              ></Input>
                              <DialogFooter>
                                <div className="flex justify-end gap-4">
                                  <Button type="reset">Clear</Button>
                                  <Buton
                                    onClick={() =>
                                      sendAdminMessagesForBookings(
                                        request.id,
                                        adminMessage
                                      )
                                    }
                                  >
                                    Send
                                  </Buton>
                                </div>
                                <DialogClose></DialogClose>
                                
                              </DialogFooter>
                            </DialogContent>
                          </Dialog> */}
                          <Button
                            size="sm"
                            className="bg-blue-600 text-white text-xs hover:bg-blue-900"
                            onClick={() =>
                              sendAdminMessagesForBookings(request.id)
                            }
                          >
                            <UserCog size={14} />
                            Send Message
                          </Button>
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
                <Dialog
                  open={isAddVehicleOpen}
                  onOpenChange={(open) => {
                    setIsAddVehicleOpen(open);
                    if (!open) {
                      setVehicleFormError("");
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={18} className="mr-2" />
                      Add New Vehicle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Vehicle</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddVehicle} className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Vehicle Details
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Company Name
                          </label>
                          <Input
                            value={vehicleForm.companyName}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "companyName",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Toyota"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Vehicle Model
                          </label>
                          <Input
                            value={vehicleForm.model}
                            onChange={(e) =>
                              handleVehicleFieldChange("model", e.target.value)
                            }
                            placeholder="e.g., Prius"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Year
                          </label>
                          <Input
                            type="number"
                            value={vehicleForm.year}
                            onChange={(e) =>
                              handleVehicleFieldChange("year", e.target.value)
                            }
                            placeholder="2024"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Vehicle Type
                          </label>
                          <Input
                            value={vehicleForm.type}
                            onChange={(e) =>
                              handleVehicleFieldChange("type", e.target.value)
                            }
                            placeholder="Sedan, SUV..."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Current Mileage (km)
                          </label>
                          <Input
                            type="number"
                            value={vehicleForm.mileage}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "mileage",
                                e.target.value,
                              )
                            }
                            placeholder="25000"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Transmission Type
                          </label>
                          <Input
                            value={vehicleForm.transmission}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "transmission",
                                e.target.value,
                              )
                            }
                            placeholder="Automatic"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Fuel Type
                          </label>
                          <Input
                            value={vehicleForm.fuelType}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "fuelType",
                                e.target.value,
                              )
                            }
                            placeholder="Hybrid"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Branch
                          </label>
                          <select
                            value={vehicleForm.branch}
                            onChange={(e) =>
                              handleVehicleFieldChange("branch", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            {branchOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Vehicle Price (LKR)
                          </label>
                          <Input
                            type="number"
                            value={vehicleForm.price}
                            onChange={(e) =>
                              handleVehicleFieldChange("price", e.target.value)
                            }
                            placeholder="7500000"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Status
                          </label>
                          <select
                            value={vehicleForm.status}
                            onChange={(e) =>
                              handleVehicleFieldChange("status", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            {statusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <Textarea
                            value={vehicleForm.description}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Brief description of the vehicle..."
                            rows={4}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Images (array)
                          </label>
                          <Textarea
                            value={vehicleForm.images}
                            onChange={(e) =>
                              handleVehicleFieldChange("images", e.target.value)
                            }
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Separate multiple image URLs with commas or new
                            lines.
                          </p>
                        </div>
                      </div>
                      {vehicleFormError && (
                        <p className="text-sm text-destructive">
                          {vehicleFormError}
                        </p>
                      )}
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddVehicleOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSavingVehicle}>
                          {isSavingVehicle ? "Saving..." : "Save Vehicle"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {adminVehicles.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No vehicles available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {adminVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-24 bg-secondary rounded flex items-center justify-center overflow-hidden">
                          {vehicle.image ? (
                            <img
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Car size={32} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {vehicle.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {vehicle.location || vehicle.branch || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {vehicle.views ?? 0} views
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {typeof vehicle.price === "number"
                              ? `LKR ${vehicle.price.toLocaleString()}`
                              : vehicle.price}
                          </p>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              vehicle.status === "Available"
                                ? "bg-green-500/20 text-green-700"
                                : vehicle.status === "Shipped"
                                  ? "bg-orange-500/20 text-orange-700"
                                  : vehicle.status === "Reserved"
                                    ? "bg-blue-500/20 text-blue-700"
                                    : "bg-red-500/20 text-red-700"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleViewVehicle(vehicle)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditVehicle(vehicle)}
                            title="Edit Vehicle"
                          >
                            <Edit size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Vehicle
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {vehicle.name}"? This action can not be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex justify-end gap-3">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteVehicle(vehicle.id)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Reviews Management Tab */}
          {activeTab === "videos" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Video Reviews Management
                  </h2>
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
                    <label className="block text-sm font-medium mb-2">
                      Video Title
                    </label>
                    <Input
                      placeholder="e.g., 2023 Toyota Camry Full Review"
                      value={newVideo.title}
                      onChange={(e) =>
                        setNewVideo({ ...newVideo, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-2 rounded bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                      placeholder="Brief description of the video content..."
                      value={newVideo.description}
                      onChange={(e) =>
                        setNewVideo({
                          ...newVideo,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      YouTube Video ID
                    </label>
                    <Input
                      placeholder="e.g., dQw4w9WgXcQ"
                      value={newVideo.videoId}
                      onChange={(e) =>
                        setNewVideo({ ...newVideo, videoId: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Find this in the YouTube URL: youtube.com/watch?v=
                      <strong>VIDEO_ID</strong>
                    </p>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full" onClick={handleAddVideo}>
                      <Plus size={18} className="mr-2" />
                      Add Video
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing Videos List */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">
                  Published Videos ({videoReviews.length})
                </h3>
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
                      <h4 className="font-semibold text-base mb-1">
                        {video.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {video.description}
                      </p>
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
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/watch?v=${video.videoId}`,
                            "_blank",
                          )
                        }
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Video</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this video from
                              the homepage? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="flex justify-end gap-3">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteVideo(video.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your email subscriber list
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <Button
                    variant="outline"
                    onClick={() =>
                      (window.location.href = "/admin/newsletters")
                    }
                  >
                    View Newsletters
                  </Button>
                  <Button
                    onClick={() => window.open("/api/subscribers/export")}
                  >
                    <FileText size={18} className="mr-2" />
                    Export List
                  </Button>
                </div>
              </div>

              <div>
                <NewsletterTable
                  setNewsletterSubscribers={setNewsletterSubscribers}
                />
              </div>
            </div>
          )}

          {/* Branch Inventory Tab */}
          {activeTab === "branches" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Branch-wise Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Nugegoda", "Matara", "Colombo"].map((branch, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-950 rounded-lg border border-border p-6"
                  >
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
                        <span className="text-sm text-muted-foreground">
                          Total Vehicles
                        </span>
                        <span className="font-bold text-lg">
                          {45 + idx * 10}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Available
                        </span>
                        <span className="font-semibold text-green-600">
                          {30 + idx * 5}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Shipped
                        </span>
                        <span className="font-semibold text-orange-600">
                          {10 + idx * 3}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Reserved
                        </span>
                        <span className="font-semibold text-blue-600">
                          {5 + idx * 2}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => {
                        if (branch === "Nugegoda") setIsNugegodaOpen(true);
                        if (branch === "Matara") setIsMataraOpen(true);
                        if (branch === "Colombo") setIsColomboOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      )
      <ChatBot />
      <Footer />
      <AdvisorSelectionModal
        open={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        bookingSlot={selectedRequestForAdvisor?.time || ""}
        onConfirm={(advisor) => {
          toast.success(`Booking assigned to ${advisor.name}`);
          setIsAdvisorModalOpen(false);
          setSelectedRequestForAdvisor(null);
        }}
      />
    </div>
  );
}