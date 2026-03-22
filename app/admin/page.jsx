"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RightPanel from "@/components/branches/RightPanel";
import InputBox from "@/components/Input";

import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Car,
  Mail,
  MapPin,
  User,
  FileText,
  Video,
  ExternalLink,
  RefreshCcw,
  Plus,
  UserCog,
  Binoculars,
  LogOut,
  Sun,
  Moon,
  CircleX,
  Route,
  Router

} from "lucide-react";

import NewsletterTable from "./NewsletterTable";
import ChatBot from "@/components/ChatBot";
import { useTheme } from "next-themes";
import { sendAdminMessagesForBookings } from "../APITriggers/sendAdminMessagesForBookings.js";
import { localStorageAPI } from "@/lib/storage/localStorage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import {
  getVideoReviews,
  addVideoReview,
  deleteVideoReview,
  editVideoReview
} from "@/app/actions/videoActions";

import AdvisorSelectionModal from "@/components/advisor-selection-modal";
import CreateAdvisorModal from "../../components/createAdvisorModel.jsx";
import { vehicleAPI } from "../../lib/api/vehicles.js";
import { set } from "date-fns/set";
import path from "node:path";


const vehicleFormDefaults = {
  companyName: "",
  model: "",
  year: "",
  type: "",
  mileage: "",
  transmission: "",
  fuelType: "",
  branch: "Nugegoda",
  price: "",
  description: "",
  images: "",
  status: "Available",
};



export default function AdminPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterSubscribers, setNewsletterSubscribers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
  });
  const [videoReviews, setVideoReviews] = useState([]);

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState(vehicleFormDefaults);
  const [vehicleFormError, setVehicleFormError] = useState("");

  const [recentRequests, setRecentRequests] = useState([]);
  const [adminVehicles, setAdminVehicles] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [videoIds, setVideoIds] = useState([]);

  const [deleteVideoId, setDeleteVideoId] = useState(null);

  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [selectedRequestForAdvisor, setSelectedRequestForAdvisor] = useState(null);
  const [branchInventory, setBranchInventory] = useState({});
  const [viewBranchModel, setViewBranchModel] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isCreateAdvisorOpen, setIsCreateAdvisorOpen] = useState(false);
  const [advisors, setAdvisors] = useState([]);
  const [showAdvisors, setShowAdvisors] = useState(false);

  const [form, setForm] = useState({
    id: "",
    buyerName: "",
    buyerEmail: "",
    phone: "",
    location: "",
    price: "",
    brand: "",
    model: "",
    year: 0
  });

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const stats = [

    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: Users,
      color: "bg-yellow-500/20 text-yellow-600",
    },
    {
      label: "Total Vehicles",
      value: totalVehicles,
      icon: Car,
      color: "bg-green-500/20 text-green-600",
    },

    {
      label: "Newsletter Subscribers",
      value: newsletterSubscribers,
      icon: Mail,
      color: "bg-blue-500/20 text-blue-600",
    },
  ];

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/Consultations/getAllBooking");
      const data = await res.json();
      setRecentRequests(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

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

  const handleVideoFieldChange = (field, value, videoId) => {
    setVideoReviews((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, [field]: value } : video
      )
    );
  }

  const handleEditVideo = async (videoId) => {
    const video = videoReviews.find((v) => v.id === videoId);
    if (!video) {
      toast.error("Video not found");
      return;
    }
    try {
      const result = await editVideoReview(videoId, {
        title: video.title,
        description: video.description,
      });
      if (result.success) {
        toast.success("Video review updated successfully");
        loadVideos();
      } else {
        toast.error("Failed to update video review");
      }
    }
    catch (error) {
      toast.error("Failed to update video review");
    }
  }


  const handleBranchInventory = async () => {
    // This function can be expanded to fetch and display inventory for each branch
    const branchInventory = await fetch("/api/branches").then(res => res.json());
    console.log("Branch Inventory:", branchInventory);
    setBranchInventory(branchInventory);
  };

  const openEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm(vehicle); // preload form
    setIsEditVehicleOpen(true);

  };

  const loadVehicles = async () => {
    const result = await vehicleAPI.getAllVehicles();
    if (result.success) {
      const sortedVehicles = [...result.data].sort(
        (a, b) => Number(b.id) - Number(a.id),
      );
      setAdminVehicles(sortedVehicles);
    }
  };


  const loadVideos = async () => {
    const result = await getVideoReviews();
    if (result.success) {
      setVideoReviews(result.data);
      setVideoIds(result.ids);
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

    // Validation
    if (
      !vehicleForm.brand?.trim() ||
      !vehicleForm.model?.trim() ||
      !vehicleForm.year ||
      !vehicleForm.price
    ) {
      setVehicleFormError("Please fill required fields.");
      setIsSavingVehicle(false);
      return;
    }


    // Convert images string → array
    const images = vehicleForm.images
      ?.split(/,|\n/)
      .map((value) => value.trim())
      .filter(Boolean) || [];

    const newVehicle = {
      brand: vehicleForm.brand.trim(),
      model: vehicleForm.model.trim(),
      year: Number(vehicleForm.year),
      price: Number(vehicleForm.price),
      mileage: Number(vehicleForm.mileage) || 0,
      transmission: vehicleForm.transmission?.trim() || null,
      fuelType: vehicleForm.fuelType?.trim() || null,
      bodyType: vehicleForm.bodyType?.trim() || null,
      engineCapacity: vehicleForm.engineCapacity
        ? Number(vehicleForm.engineCapacity)
        : null,
      location: vehicleForm.location?.trim() || null,
      dealer: vehicleForm.dealer?.trim() || null,
      condition: vehicleForm.condition || null,
      edition: vehicleForm.edition || null,
      images
    };

    try {

      const result = await vehicleAPI.addVehicle(newVehicle);

      if (result.success) {
        await loadVehicles();
        setVehicleForm(vehicleFormDefaults);
        setIsAddVehicleOpen(false);
        toast.success("Vehicle added successfully");

      } else {
        setVehicleFormError(result.error || "Failed to add vehicle.");
        toast.error(result.error || "Failed to add vehicle.");
      }

    } catch (error) {
      setVehicleFormError("Something went wrong.");
    }

    setIsSavingVehicle(false);
  };

  const fetchAllAdvisors = async () => {
    try {
      const res = await fetch("/api/admin/advisors");
      const data = await res.json();
      console.log("Fetched Advisors:", data);

      setAdvisors(data.advisors);
    } catch (error) {
      console.error("Failed to fetch advisors", error);
    }
  };

  useEffect(() => {
    fetchAllAdvisors();

  }, []);


  const handleDeleteAdvisors = async () => {
    try {
      await fetchAllAdvisors();
      setShowAdvisors(true);
    } catch (error) {
      console.error("Failed to delete advisors", error);
    }
  };

  const handleDeleteAdvisor = async (advisorId) => {
    if (!advisorId) {
      toast.error("Invalid advisor ID ❌");
      return;
    }

    try {
      const res = await fetch(`/api/Advisors/${advisorId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Advisor deleted successfully ✅");
        await fetchAllAdvisors();
        Router.refresh();
      } else {
        toast.error(data.message || "Failed to delete advisor ❌");
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete advisor ❌");
    }
  };


  const handleDeleteVehicle = async (vehicleId) => {

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Vehicle deleted successfully");
        Router.refresh();
      }

    } catch (error) {
      toast.error("Failed to delete vehicle");

    }
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

  const handleAdminRequest = () => {
    fetch("/api/newsletter/listOfSubscriptions")
      .then((res) => res.json())
      .then((data) => {
        setNewsletterSubscribers(data.length);
      });

    fetch("/api/vehicles/getVehicles").
      then((res) => res.json())
      .then((data) => {
        setTotalVehicles(data);
      });

    fetch("/api/Consultations/getAllBooking").
      then((res) => res.json())
      .then((data) => {
        const pending = Array.isArray(data)
          ? data.filter((req) => req.status === "PENDING").length
          : (data.data || []).filter((req) => req.status === "PENDING").length;
        setPendingRequests(pending);
      });

  }

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
    fetchBookings();
    loadVehicles();
    loadVideos();
    handleAdminRequest();
    handleBranchInventory();
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
    } else if (tabId === "advisors") {
      localStorageAPI.clearNotification("admin", "advisors");
    }

    const notifs = localStorageAPI.getNotifications();
    setNotifications(notifs.admin);
  };

  const handleEditVehicle = async (event) => {
    event.preventDefault();

    const images = vehicleForm.images.toString().split(/,|\n/).map((value) => value.trim()).filter(Boolean);

    const updatedVehicle = {
      brand: vehicleForm.brand,
      model: vehicleForm.model,
      year: Number(vehicleForm.year),
      price: Number(vehicleForm.price),
      mileage: Number(vehicleForm.mileage),
      transmission: vehicleForm.transmission,
      fuelType: vehicleForm.fuelType,
      bodyType: vehicleForm.bodyType,
      location: vehicleForm.location,
      images
    };
    console.log("UpdatedVehicle:", updatedVehicle);
    const id = editingVehicle.id;
    console.log("Vehicle ID:", id);
    const res = await fetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedVehicle)
    });

    if (res.ok) {
      await loadVehicles();
      setIsEditVehicleOpen(false);
      toast.success("Vehicle updated successfully");
    }
    else {
      setIsEditVehicleOpen(false);
      toast.error("Failed to update vehicle");
    }


  };

  useEffect(() => {
    fetch("/api/cars/brands")
      .then(res => res.json())
      .then(setBrands);
  }, []);

  // 🔹 Load models when brand changes
  useEffect(() => {
    if (!form.brand) return;

    setLoadingModels(true);
    fetch(`/api/cars/models?brand=${form.brand}`)
      .then(res => res.json())
      .then(data => setModels(data))
      .finally(() => setLoadingModels(false));
  }, [form.brand]);

  useEffect(() => {
    if (!form.brand || !form.model) return;

    setLoadingYears(true);
    fetch(`/api/cars/years?brand=${form.brand}&model=${form.model}`)
      .then(res => res.json())
      .then(data => setYears(data))
      .finally(() => setLoadingYears(false));
  }, [form.model]);

  const handleBrandChange = (e) => {
    setForm({
      ...form,
      brand: e.target.value,
      model: "",
      year: ""
    });
    setModels([]);
    setYears([]);
  };

  const handleModelChange = (e) => {
    setForm({
      ...form,
      model: e.target.value,
      year: ""
    });
    setYears([]);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }


  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setLoadingTransactions(true);

    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        setForm({
          id: "",
          buyerName: "",
          buyerEmail: "",
          phone: "",
          location: "",
          price: "",
          brand: "",
          model: "",
          year: 0
        });

        toast.success("Transaction saved successfully");
      }


    }
    catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(error.message || "Failed to save transaction");
    }
    finally {
      setLoadingTransactions(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="font-semibold">
                {session?.user?.name || session?.user?.email || "Admin User"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {session?.user?.email ? session?.user?.email.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex items-center gap-2 text-white/80 py-2 cursor-pointer bg-red-600 p-2 rounded-md hover:text-white pl-2 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  : stat.label === "Pending Requests" ? pendingRequests : stat.label === "Total Vehicles" ? totalVehicles : stat.value}
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
              {
                id: "advisors",
                label: "Create an advisor",
                icon: UserCog,
                count: 0,
              },
              {
                id: "transactions",
                label: "Transactions",
                icon: FileText,
                count: 0,
              }
            ].map((tab) => (
              <Button
                key={tab.id}
                // onClick={() => setActiveTab(tab.id)}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 hover:text-white hover:bg-black rounded font-medium cursor-pointer transition whitespace-nowrap relative ${activeTab === tab.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : ""
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
                      {/* <th className="px-4 py-3 text-left font-semibold text-sm">
                        Vehicle Details
                      </th> */}
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
                        {/* <td>{request.vehicleType}</td> */}
                        <td>{request.preferredDate.split("T")[0]}</td>
                        <td>{request.preferredTime}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === "ACCEPTED"
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Brand */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Brand
                          </label>
                          <Input
                            value={vehicleForm.brand}
                            onChange={(e) => handleVehicleFieldChange("brand", e.target.value)}
                            placeholder="Toyota"
                            required
                          />
                        </div>

                        {/* Model */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Model
                          </label>
                          <Input
                            value={vehicleForm.model}
                            onChange={(e) => handleVehicleFieldChange("model", e.target.value)}
                            placeholder="Prius"
                            required
                          />
                        </div>

                        {/* Year */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Year
                          </label>
                          <Input
                            type="number"
                            value={vehicleForm.year}
                            onChange={(e) => handleVehicleFieldChange("year", e.target.value)}
                            required
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Price (LKR)
                          </label>
                          <Input
                            type="number"
                            value={vehicleForm.price}
                            onChange={(e) => handleVehicleFieldChange("price", e.target.value)}
                            required
                          />
                        </div>

                        {/* Mileage */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Mileage
                          </label>
                          <Input
                            type="number"
                            value={vehicleForm.mileage}
                            onChange={(e) => handleVehicleFieldChange("mileage", e.target.value)}
                          />
                        </div>

                        {/* Transmission */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Transmission
                          </label>
                          <Input
                            value={vehicleForm.transmission}
                            onChange={(e) => handleVehicleFieldChange("transmission", e.target.value)}
                            placeholder="Automatic"
                          />
                        </div>

                        {/* Fuel Type */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Fuel Type
                          </label>
                          <Input
                            value={vehicleForm.fuelType}
                            onChange={(e) => handleVehicleFieldChange("fuelType", e.target.value)}
                            placeholder="Hybrid"
                          />
                        </div>

                        {/* Body Type */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Body Type
                          </label>
                          <Input
                            value={vehicleForm.bodyType}
                            onChange={(e) => handleVehicleFieldChange("bodyType", e.target.value)}
                            placeholder="SUV"
                          />
                        </div>

                        {/* Engine Capacity */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Engine Capacity (cc)
                          </label>
                          <Input
                            type="number"
                            value={vehicleForm.engineCapacity}
                            onChange={(e) => handleVehicleFieldChange("engineCapacity", e.target.value)}
                          />
                        </div>
                        {/* Condition */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Condition
                          </label>
                          <select
                            value={vehicleForm.condition}
                            onChange={(e) => handleVehicleFieldChange("condition", e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          >
                            <option value="NEW">New</option>
                            <option value="USED">Used</option>
                            <option value="RECONDITIONED">Reconditioned</option>
                          </select>
                        </div>
                        {/* Location */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Location
                          </label>
                          <Input
                            value={vehicleForm.location}
                            onChange={(e) => handleVehicleFieldChange("location", e.target.value)}
                            placeholder="Colombo"
                          />
                        </div>
                        {/* Dealer */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Dealer
                          </label>
                          <Input
                            value={vehicleForm.dealer}
                            onChange={(e) => handleVehicleFieldChange("dealer", e.target.value)}
                            placeholder="Sameera Auto Traders"
                          />
                        </div>
                        {/* Images */}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium mb-2 block">
                            Images
                          </label>
                          <Textarea
                            value={vehicleForm.images}
                            onChange={(e) => handleVehicleFieldChange("images", e.target.value)}
                            placeholder="image1.jpg,image2.jpg"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddVehicleOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Vehicle
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
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <img
                              src={vehicle.images[0]}
                              alt={vehicle.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Car size={32} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {vehicle.brand} {vehicle.model} ({vehicle.year})
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
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => openEditVehicle(vehicle)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Dialog open={isEditVehicleOpen} onOpenChange={setIsEditVehicleOpen} className="bg-transparent">
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">

                              <DialogHeader>
                                <DialogTitle>Edit Vehicle</DialogTitle>
                              </DialogHeader>

                              <form onSubmit={handleEditVehicle} className="space-y-4">

                                <Input
                                  value={vehicleForm.brand}
                                  onChange={(e) => handleVehicleFieldChange("brand", e.target.value)}
                                  placeholder="Brand"
                                />

                                <Input
                                  value={vehicleForm.model}
                                  onChange={(e) => handleVehicleFieldChange("model", e.target.value)}
                                  placeholder="Model"
                                />

                                <Input
                                  type="number"
                                  value={vehicleForm.year}
                                  onChange={(e) => handleVehicleFieldChange("year", e.target.value)}
                                />

                                <Input
                                  type="number"
                                  value={vehicleForm.price}
                                  onChange={(e) => handleVehicleFieldChange("price", e.target.value)}
                                />

                                <Textarea
                                  value={vehicleForm.images}
                                  onChange={(e) => handleVehicleFieldChange("images", e.target.value)}
                                />

                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsEditVehicleOpen(false)}
                                  >
                                    Cancel
                                  </Button>

                                  <Button type="submit">
                                    Update Vehicle
                                  </Button>
                                </DialogFooter>

                              </form>

                            </DialogContent>
                          </Dialog>
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
              <div className="bg-white dark:bg-black/50 rounded-lg border border-border p-6 mb-6">
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
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
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
                    <div className="flex items-end pt-2">
                      <Button className="w-full" onClick={handleAddVideo}>
                        <Plus size={18} className="mr-2" />
                        Add Video
                      </Button>
                    </div>
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
                    <div className="relative h-24 w-40 shrink-0 bg-secondary rounded overflow-hidden group">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Video size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="grow">
                      <h4 className="font-semibold text-base mb-1">
                        {video.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {video.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Uploaded: { }</span>
                        <span>{video.views} views</span>
                        <span>ID: {video.youtubeId}</span>

                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/watch?v=${video.youtubeId}`,
                            "_blank",
                          )
                        }
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Edit size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-bold flex justify-between items-center">
                              Edit Video Review
                              <AlertDialogCancel size="xs" variant="outline" className="ml-4 cursor-pointer" >
                                <CircleX />
                              </AlertDialogCancel>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will allow you to edit the video title and
                              description. To change the video itself, please
                              delete and re-add with the new YouTube ID.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="p-4">
                            <Input
                              className="mb-4"
                              value={video.title}
                              onChange={(e) => handleVideoFieldChange("title", e.target.value, video.id)}
                              placeholder="Video Title"
                            />
                            <Textarea
                              value={video.description}
                              onChange={(e) => handleVideoFieldChange("description", e.target.value, video.id)}
                              placeholder="Video Description"
                            />
                            <Button onClick={() => {
                              handleEditVideo(video.id);

                            }} className="mt-4">
                              Save Changes
                            </Button>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
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

          {activeTab === "advisors" && (
            <div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Advisor Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create and manage advisor accounts
                  </p>
                </div>

                <div className="gap-3 flex">
                  <Button onClick={() => setIsCreateAdvisorOpen(true)}>
                    <UserCog size={18} className="mr-2" />
                    Create Advisor
                  </Button>
                </div>

              </div>

              <div className="text-muted-foreground">
                Advisors created here will receive temporary credentials
                and will be required to change their password on first login.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
                {
                  advisors.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      No advisors created yet.
                    </div>
                  ) : (
                    advisors.map((advisor) => (
                      <div key={advisor.id} className="bg-white dark:bg-black/50 rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3 mb-4 justify-between">
                          <div className="flex gap-2">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <UserCog size={24} className="text-primary" />

                            </div>
                            <div>
                              <h3 className="font-bold text-xl">{advisor.name}</h3>
                              <p className="text-sm text-muted-foreground">Advisor</p>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm" onClick={() => {
                              handleDeleteAdvisor(advisor.id);
                            }
                            } className="ml-auto">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>


                    )))
                }
              </div>
            </div>
          )}

          {/* Branch Inventory Tab */}
          {activeTab === "branches" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Branch-wise Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(branchInventory).map(([branch, vehicles]) => (
                  <div key={branch} className="bg-white dark:bg-black/50 rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{branch}</h3>
                        <p className="text-sm text-muted-foreground">Branch</p>
                      </div>
                    </div>
                    {vehicles.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No vehicles in this branch.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total Vehicles
                          </span>
                          <span className="font-bold text-lg">
                            {vehicles.length}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {/* List of vehicles brands only */}
                          {Array.from(new Set(vehicles.map((v) => v.brand))).map((brand) => (
                            <div key={brand} className="flex justify-between items-center border border-border rounded cursor-pointer hover:bg-red-50 px-3 py-2" onClick={() => {
                              setSelectedBrand(brand);
                              setViewBranchModel(true);
                            }}>
                              <span className="text-sm text-muted-foreground">{brand}</span>
                              <span className="font-bold">{vehicles.filter((v) => v.brand === brand).length}</span>
                            </div>
                          ))}
                        </div>

                        <div className="max-h-48 overflow-y-auto">
                          <Button onClick={() => {
                            setSelectedBrand(null);
                            setViewBranchModel(true);
                          }
                          } className="w-full mt-4 cursor-pointer" variant="outline">
                            View Details
                          </Button>

                        </div>
                        {
                          viewBranchModel && (
                            <>
                              <RightPanel branch={branch} brand={selectedBrand} setViewBranchModel={setViewBranchModel} />
                            </>
                          )
                        }
                      </div>
                    )
                    }

                  </div>
                ))
                }


              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Transaction Management</h2>
              </div>
              <form
                name="sumitTransaction"
                onSubmit={handleTransactionSubmit}
                className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-2xl space-y-6"
              >
                <h2 className="text-xl font-bold">Transaction Form</h2>

                {/* 🔹 Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <InputBox name="id" placeholder="Transaction ID" onChange={handleChange} value={form.id} />
                  <InputBox name="buyerName" placeholder="Buyer Name" onChange={handleChange} value={form.buyerName} />

                  <InputBox name="buyerEmail" placeholder="Email" onChange={handleChange} value={form.buyerEmail} />
                  <InputBox name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} />

                  <InputBox name="location" placeholder="Location" onChange={handleChange} value={form.location} />
                  <InputBox name="price" placeholder="Price" onChange={handleChange} value={form.price} />
                </div>

                {/* 🔹 Car Selection */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Brand */}
                  <select
                    value={form.brand}
                    onChange={handleBrandChange}
                    className="input disabled:bg-gray-100 p-2 bg-gray-200 text-black dark:bg-black/80 dark:text-white"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map(b => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>

                  {/* Model */}
                  <select
                    value={form.model}
                    onChange={handleModelChange}
                    disabled={!form.brand || loadingModels}
                    className="input disabled:bg-gray-100 p-2 bg-gray-200 text-black dark:bg-black/80 dark:text-white"
                    required
                  >
                    <option value="">
                      {loadingModels ? "Loading..." : "Select Model"}
                    </option>
                    {models.map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>

                  {/* Year */}
                  <select
                    value={form.year}
                    onChange={handleChange}
                    name="year"
                    required
                    disabled={!form.model || loadingYears}
                    className="input disabled:bg-gray-100 p-2 bg-gray-200 text-black dark:bg-black/80 dark:text-white"
                  >
                    <option value="">
                      {loadingYears ? "Loading..." : "Select Year"}
                    </option>
                    {years.map(y => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg ${loadingTransactions ? "cursor-not-allowed" : ""}`}
                >
                  {loadingTransactions ? "Saving..." : "Save Transaction"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <ChatBot />
      <AdvisorSelectionModal
        open={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        bookingSlot={selectedRequestForAdvisor?.time || ""}
        onConfirm={async (advisor) => {
          await fetch("/api/Consultations/assignAdvisor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: selectedRequestForAdvisor.id,
              advisorId: advisor.id,
            }),
          });

          toast.success(`Booking assigned to ${advisor.name}`);

          await fetchBookings(); // refresh admin table
          setIsAdvisorModalOpen(false);
          setSelectedRequestForAdvisor(null);
        }}
      />
      <CreateAdvisorModal
        open={isCreateAdvisorOpen}
        onClose={() => setIsCreateAdvisorOpen(false)}
      />
    </div>
  );
}
