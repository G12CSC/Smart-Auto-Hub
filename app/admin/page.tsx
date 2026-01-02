"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
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
} from "@/components/ui/dialog";
import { BRANCHES } from "@/lib/branches";
import { vehicleAPI } from "@/lib/api/vehicles";

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

const branchOptions = ["Colombo", "Matara", "Nugegoda"];
const statusOptions = ["Available", "Shipped", "Reserved", "Not Available"];
const transmissionOptions = ["Automatic", "Manual"];
const fuelOptions = ["Petrol", "Diesel", "EV", "Hybrid"];
const MAX_IMAGE_COUNT = 6;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_JPEG_QUALITY = 0.82;
const MAX_IMAGE_DATA_URL_CHARS = 750000;
const MAX_TOTAL_IMAGE_DATA_URL_CHARS = 2000000;

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
  images: [],
  status: "Available",
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Invalid file data."));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("File read failed."));
    reader.readAsDataURL(file);
  });

const loadImageElement = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Invalid image file."));
    };
    image.src = objectUrl;
  });

const processVehicleImage = async (file) => {
  const image = await loadImageElement(file);
  const shouldResize =
    file.size > MAX_IMAGE_BYTES ||
    image.width > MAX_IMAGE_DIMENSION ||
    image.height > MAX_IMAGE_DIMENSION;

  if (!shouldResize) {
    return readFileAsDataUrl(file);
  }

  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.width, image.height)
  );
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Image processing failed.");
  }
  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  return canvas.toDataURL("image/jpeg", IMAGE_JPEG_QUALITY);
};

const recentRequests = [];

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
    description:
      "Comprehensive review of the Suzuki Swift 2023, discussing its pros and cons for Sri Lankan buyers.",
    videoId: "dQw4w9WgXcQ",
    uploadDate: "08/11/2025",
    views: "15.2K",
  },
];

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const getStatusKey = (status) => {
  const normalized = normalizeValue(status);
  if (normalized === "available") return "available";
  if (normalized === "shipped") return "shipped";
  if (normalized === "reserved") return "reserved";
  return "other";
};

const getStatusBadgeClass = (status) => {
  switch (normalizeValue(status)) {
    case "available":
      return "bg-green-500/20 text-green-700";
    case "shipped":
      return "bg-orange-500/20 text-orange-700";
    case "reserved":
      return "bg-blue-500/20 text-blue-700";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatVehiclePrice = (price) =>
  typeof price === "number" ? `LKR ${price.toLocaleString()}` : price || "N/A";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [adminVehicles, setAdminVehicles] = useState([]);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [vehicleDialogMode, setVehicleDialogMode] = useState("add");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState(vehicleFormDefaults);
  const [vehicleFormError, setVehicleFormError] = useState("");
  const [selectedImageNames, setSelectedImageNames] = useState([]);
  const [isViewVehicleOpen, setIsViewVehicleOpen] = useState(false);
  const [viewVehicle, setViewVehicle] = useState(null);
  const [isDeleteVehicleOpen, setIsDeleteVehicleOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deleteVehicleError, setDeleteVehicleError] = useState("");
  const [isDeletingVehicle, setIsDeletingVehicle] = useState(false);
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [selectedBranchSlug, setSelectedBranchSlug] = useState(null);
  // Notification counts for each admin tab.
  const [notifications, setNotifications] = useState({
    requests: 0,
    vehicles: 0,
    videos: 0,
    newsletter: 0,
  });
  
  const loadVehicles = async () => {
    const result = await vehicleAPI.getAllVehicles();
    if (result.success) {
      const sortedVehicles = [...result.data].sort(
        (a, b) => Number(b.id) - Number(a.id)
      );
      setAdminVehicles(sortedVehicles);
    }
  };

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
    loadVehicles();

    // ✅ Polling every 5 seconds
    const interval = setInterval(() => {
      fetchBookings();
      loadVehicles();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handleVehicleFieldChange = (field, value) => {
    setVehicleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageFilesChange = async (event) => {
    const input = event.target;
    const files = Array.from(input.files || []);

    setVehicleFormError("");

    if (files.length === 0) {
      setSelectedImageNames([]);
      handleVehicleFieldChange("images", []);
      return;
    }

    if (files.length > MAX_IMAGE_COUNT) {
      setVehicleFormError(`Select up to ${MAX_IMAGE_COUNT} images.`);
      input.value = "";
      setSelectedImageNames([]);
      handleVehicleFieldChange("images", []);
      return;
    }

    try {
      const imageData = await Promise.all(files.map(processVehicleImage));
      const totalChars = imageData.reduce((sum, value) => sum + value.length, 0);
      const maxChars = imageData.reduce(
        (max, value) => Math.max(max, value.length),
        0
      );

      if (maxChars > MAX_IMAGE_DATA_URL_CHARS) {
        setVehicleFormError(
          "One or more images are still too large after resize. Please choose smaller files."
        );
        input.value = "";
        setSelectedImageNames([]);
        handleVehicleFieldChange("images", []);
        return;
      }

      if (totalChars > MAX_TOTAL_IMAGE_DATA_URL_CHARS) {
        setVehicleFormError(
          "Selected images are too large to store locally. Use fewer or smaller files."
        );
        input.value = "";
        setSelectedImageNames([]);
        handleVehicleFieldChange("images", []);
        return;
      }

      setSelectedImageNames(files.map((file) => file.name));
      handleVehicleFieldChange("images", imageData);
    } catch (error) {
      console.error("Failed to read image files", error);
      setVehicleFormError("Unable to load selected images.");
      input.value = "";
      setSelectedImageNames([]);
      handleVehicleFieldChange("images", []);
    }
  };

  const resetVehicleForm = () => {
    setVehicleForm(vehicleFormDefaults);
    setSelectedImageNames([]);
    setVehicleFormError("");
  };

  const populateVehicleFormFromVehicle = (vehicle) => {
    const images =
      Array.isArray(vehicle?.images) && vehicle.images.length > 0
        ? vehicle.images
        : vehicle?.image
          ? [vehicle.image]
          : [];

    setVehicleForm({
      companyName: vehicle?.make || "",
      model: vehicle?.model || "",
      year: vehicle?.year ? String(vehicle.year) : "",
      type: vehicle?.type || "",
      mileage: vehicle?.mileage ? String(vehicle.mileage) : "",
      transmission: vehicle?.transmission || "",
      fuelType: vehicle?.fuelType || "",
      branch: vehicle?.location || vehicle?.branch || "Nugegoda",
      price: vehicle?.price ? String(vehicle.price) : "",
      description: vehicle?.description || "",
      images,
      status: vehicle?.status || "Available",
    });
    setSelectedImageNames([]);
    setVehicleFormError("");
  };

  const handleOpenAddVehicle = () => {
    setVehicleDialogMode("add");
    setEditingVehicle(null);
    resetVehicleForm();
    setIsVehicleDialogOpen(true);
  };

  const handleOpenEditVehicle = (vehicle) => {
    setVehicleDialogMode("edit");
    setEditingVehicle(vehicle);
    populateVehicleFormFromVehicle(vehicle);
    setIsVehicleDialogOpen(true);
  };

  const handleVehicleDialogOpenChange = (open) => {
    setIsVehicleDialogOpen(open);
    if (!open) {
      setEditingVehicle(null);
      resetVehicleForm();
    }
  };

  const buildVehiclePayload = () => {
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
      return { error: "Please fill in all required fields." };
    }

    const images = Array.isArray(vehicleForm.images)
      ? vehicleForm.images.filter(
          (image) => typeof image === "string" && image.trim()
        )
      : String(vehicleForm.images || "")
          .split(/,|\n/)
          .map((value) => value.trim())
          .filter(Boolean);

    const totalChars = images.reduce((sum, value) => sum + value.length, 0);
    if (totalChars > MAX_TOTAL_IMAGE_DATA_URL_CHARS) {
      return {
        error:
          "Selected images are too large to store locally. Use fewer or smaller files.",
      };
    }

    const nameParts = [
      vehicleForm.year,
      vehicleForm.companyName,
      vehicleForm.model,
    ].filter(Boolean);
    const vehicleName = nameParts.join(" ");

    return {
      data: {
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
      },
    };
  };

  const handleAddVehicle = async (event) => {
    event.preventDefault();
    setIsSavingVehicle(true);
    setVehicleFormError("");

    try {
      const { data, error } = buildVehiclePayload();
      if (error) {
        setVehicleFormError(error);
        return;
      }

      const result = await vehicleAPI.addVehicle(data);
      if (result.success) {
        await loadVehicles();
        resetVehicleForm();
        setIsVehicleDialogOpen(false);
      } else {
        setVehicleFormError(result.error || "Failed to add vehicle.");
      }
    } catch (error) {
      console.error("Failed to add vehicle", error);
      setVehicleFormError(
        "Failed to save vehicle. Please try smaller images."
      );
    } finally {
      setIsSavingVehicle(false);
    }
  };

  const handleUpdateVehicle = async (event) => {
    event.preventDefault();

    if (!editingVehicle) {
      setVehicleFormError("Select a vehicle to edit.");
      return;
    }

    setIsSavingVehicle(true);
    setVehicleFormError("");

    try {
      const { data, error } = buildVehiclePayload();
      if (error) {
        setVehicleFormError(error);
        return;
      }

      const result = await vehicleAPI.updateVehicle(editingVehicle.id, data);
      if (result.success) {
        await loadVehicles();
        resetVehicleForm();
        setEditingVehicle(null);
        setIsVehicleDialogOpen(false);
      } else {
        setVehicleFormError(result.error || "Failed to update vehicle.");
      }
    } catch (error) {
      console.error("Failed to update vehicle", error);
      setVehicleFormError("Failed to update vehicle. Please try again.");
    } finally {
      setIsSavingVehicle(false);
    }
  };

  const handleViewVehicle = (vehicle) => {
    setViewVehicle(vehicle);
    setIsViewVehicleOpen(true);
  };

  const closeViewVehicleDialog = () => {
    setIsViewVehicleOpen(false);
    setViewVehicle(null);
  };

  const handleOpenDeleteVehicle = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteVehicleError("");
    setIsDeleteVehicleOpen(true);
  };

  const closeDeleteVehicleDialog = () => {
    setIsDeleteVehicleOpen(false);
    setVehicleToDelete(null);
    setDeleteVehicleError("");
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    setIsDeletingVehicle(true);
    setDeleteVehicleError("");

    try {
      const result = await vehicleAPI.deleteVehicle(vehicleToDelete.id);
      if (result.success) {
        await loadVehicles();
        closeDeleteVehicleDialog();
      } else {
        setDeleteVehicleError(result.error || "Failed to delete vehicle.");
      }
    } catch (error) {
      console.error("Failed to delete vehicle", error);
      setDeleteVehicleError("Failed to delete vehicle.");
    } finally {
      setIsDeletingVehicle(false);
    }
  };

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

  const branchInventory = BRANCHES.map((branch) => {
    const branchName = normalizeValue(branch.name);
    const branchVehicles = adminVehicles.filter((vehicle) => {
      const location = normalizeValue(vehicle.location || vehicle.branch);
      return location === branchName;
    });

    const counts = branchVehicles.reduce(
      (acc, vehicle) => {
        const statusKey = getStatusKey(vehicle.status);
        if (statusKey === "available") {
          acc.available += 1;
        } else if (statusKey === "shipped") {
          acc.shipped += 1;
        } else if (statusKey === "reserved") {
          acc.reserved += 1;
        } else {
          acc.other += 1;
        }
        acc.total += 1;
        return acc;
      },
      { total: 0, available: 0, shipped: 0, reserved: 0, other: 0 }
    );

    return {
      ...branch,
      ...counts,
      vehicles: branchVehicles,
    };
  });

  const selectedBranch =
    branchInventory.find((branch) => branch.slug === selectedBranchSlug) || null;

  const handleOpenBranchDetails = (branchSlug) => {
    setSelectedBranchSlug(branchSlug);
    setIsBranchDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
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
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition"
            >
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
              <button
                key={tab.id}
                // onClick={() => setActiveTab(tab.id)}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition whitespace-nowrap relative ${
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
                        <td>{request.preferredDate}</td>
                        <td>{request.preferredTime}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === "ACCEPTED"
                                ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                                : request.status === "REJECTED"
                                ? "bg-rose-500/20 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300"
                                : "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
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
                              </button>
                            </>
                          )}
                          <button
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() =>
                              sendAdminMessagesForBookings(request.id)
                            }
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
                <Button onClick={handleOpenAddVehicle}>
                  <Plus size={18} className="mr-2" />
                  Add New Vehicle
                </Button>
                <Dialog
                  open={isVehicleDialogOpen}
                  onOpenChange={handleVehicleDialogOpenChange}
                >
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {vehicleDialogMode === "edit"
                          ? "Edit Vehicle"
                          : "Add Vehicle"}
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={
                        vehicleDialogMode === "edit"
                          ? handleUpdateVehicle
                          : handleAddVehicle
                      }
                      className="space-y-4"
                    >
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
                                e.target.value
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
                                e.target.value
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
                          <select
                            value={vehicleForm.transmission}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "transmission",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            <option value="" disabled>
                              Select transmission
                            </option>
                            {transmissionOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Fuel Type
                          </label>
                          <select
                            value={vehicleForm.fuelType}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "fuelType",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            <option value="" disabled>
                              Select fuel type
                            </option>
                            {fuelOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Branch
                          </label>
                          <select
                            value={vehicleForm.branch}
                            onChange={(e) =>
                              handleVehicleFieldChange(
                                "branch",
                                e.target.value
                              )
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
                                e.target.value
                              )
                            }
                            placeholder="Brief description of the vehicle..."
                            rows={4}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Images
                          </label>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageFilesChange}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedImageNames.length > 0
                              ? `Selected: ${selectedImageNames.join(", ")}`
                              : vehicleDialogMode === "edit" &&
                                  Array.isArray(vehicleForm.images) &&
                                  vehicleForm.images.length > 0
                                ? `Using ${vehicleForm.images.length} existing image${
                                    vehicleForm.images.length > 1 ? "s" : ""
                                  }. Choose files to replace.`
                                : "Select up to 6 images. Large images are resized to 1600px and compressed."}
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
                          onClick={() => handleVehicleDialogOpenChange(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSavingVehicle}>
                          {isSavingVehicle
                            ? "Saving..."
                            : vehicleDialogMode === "edit"
                              ? "Update Vehicle"
                              : "Save Vehicle"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {adminVehicles.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No vehicles available yet.</div>
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
                            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                          ) : (
                            <Car size={32} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.name}</h3>
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
                            {typeof vehicle.price === "number" ? `LKR ${vehicle.price.toLocaleString()}` : vehicle.price}
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
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEditVehicle(vehicle)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDeleteVehicle(vehicle)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Dialog
                open={isViewVehicleOpen}
                onOpenChange={(open) => {
                  setIsViewVehicleOpen(open);
                  if (!open) {
                    setViewVehicle(null);
                  }
                }}
              >
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {viewVehicle?.name || "Vehicle Details"}
                    </DialogTitle>
                  </DialogHeader>
                  {viewVehicle ? (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                          <div className="h-56 w-full rounded-lg bg-secondary overflow-hidden">
                            <img
                              src={
                                viewVehicle.image ||
                                (Array.isArray(viewVehicle.images) &&
                                  viewVehicle.images[0]) ||
                                "/placeholder.svg"
                              }
                              alt={viewVehicle.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold">
                              {formatVehiclePrice(viewVehicle.price)}
                            </p>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                                viewVehicle.status
                              )}`}
                            >
                              {viewVehicle.status || "Unknown"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {viewVehicle.location ||
                              viewVehicle.branch ||
                              "Location not set"}
                          </p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Make
                              </p>
                              <p className="font-medium">
                                {viewVehicle.make || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Model
                              </p>
                              <p className="font-medium">
                                {viewVehicle.model || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Year
                              </p>
                              <p className="font-medium">
                                {viewVehicle.year || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Mileage
                              </p>
                              <p className="font-medium">
                                {viewVehicle.mileage
                                  ? `${viewVehicle.mileage.toLocaleString()} km`
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Transmission
                              </p>
                              <p className="font-medium">
                                {viewVehicle.transmission || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Fuel Type
                              </p>
                              <p className="font-medium">
                                {viewVehicle.fuelType || "N/A"}
                              </p>
                            </div>
                          </div>
                          {viewVehicle.id && (
                            <Button asChild variant="outline" className="w-full">
                              <Link href={`/vehicles/${viewVehicle.id}`}>
                                View Full Page
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {viewVehicle.description ||
                            "No description available."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a vehicle to view details.
                    </p>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeViewVehicleDialog}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isDeleteVehicleOpen}
                onOpenChange={(open) => {
                  setIsDeleteVehicleOpen(open);
                  if (!open) {
                    setVehicleToDelete(null);
                    setDeleteVehicleError("");
                  }
                }}
              >
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete Vehicle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold">
                        {vehicleToDelete?.name || "this vehicle"}
                      </span>
                      ? This will remove it from the admin list.
                    </p>
                    {deleteVehicleError && (
                      <p className="text-sm text-destructive">
                        {deleteVehicleError}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeDeleteVehicleDialog}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteVehicle}
                      disabled={isDeletingVehicle}
                    >
                      {isDeletingVehicle ? "Deleting..." : "Delete Vehicle"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                    <Button className="w-full">
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
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your email subscriber list
                  </p>
                </div>
                <Button>
                  <FileText size={18} className="mr-2" />
                  Export List
                </Button>
              </div>

              <div>
                <NewsletterTable />
              </div>
            </div>
          )}

          {/* Branch Inventory Tab */}
          {activeTab === "branches" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Branch-wise Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {branchInventory.map((branch) => (
                  <div
                    key={branch.slug}
                    className="bg-secondary/30 rounded-lg border border-border p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{branch.name}</h3>
                        <p className="text-sm text-muted-foreground">Branch</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Vehicles
                        </span>
                        <span className="font-bold text-lg">{branch.total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Available
                        </span>
                        <span className="font-semibold text-green-600">
                          {branch.available}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Shipped
                        </span>
                        <span className="font-semibold text-orange-600">
                          {branch.shipped}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Reserved
                        </span>
                        <span className="font-semibold text-blue-600">
                          {branch.reserved}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => handleOpenBranchDetails(branch.slug)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>

              <Dialog
                open={isBranchDialogOpen}
                onOpenChange={(open) => {
                  setIsBranchDialogOpen(open);
                  if (!open) {
                    setSelectedBranchSlug(null);
                  }
                }}
              >
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedBranch
                        ? `${selectedBranch.name} Branch Inventory`
                        : "Branch Inventory"}
                    </DialogTitle>
                  </DialogHeader>
                  {selectedBranch ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-primary" />
                          <span>{selectedBranch.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car size={16} className="text-primary" />
                          <span>{selectedBranch.total} vehicles total</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-lg border border-border bg-secondary/30 p-3">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="text-lg font-semibold">
                            {selectedBranch.total}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/30 p-3">
                          <p className="text-xs text-muted-foreground">
                            Available
                          </p>
                          <p className="text-lg font-semibold text-green-600">
                            {selectedBranch.available}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/30 p-3">
                          <p className="text-xs text-muted-foreground">
                            Shipped
                          </p>
                          <p className="text-lg font-semibold text-orange-600">
                            {selectedBranch.shipped}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/30 p-3">
                          <p className="text-xs text-muted-foreground">
                            Reserved
                          </p>
                          <p className="text-lg font-semibold text-blue-600">
                            {selectedBranch.reserved}
                          </p>
                        </div>
                      </div>

                      {selectedBranch.other > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Other status vehicles: {selectedBranch.other}
                        </p>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold mb-3">
                          Recent Vehicles
                        </h4>
                        {selectedBranch.vehicles.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No vehicles available for this branch yet.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {selectedBranch.vehicles
                              .slice(0, 5)
                              .map((vehicle) => (
                                <div
                                  key={vehicle.id}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border p-3"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {vehicle.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {vehicle.make || "Unknown make"}
                                      {vehicle.model
                                        ? ` | ${vehicle.model}`
                                        : ""}
                                      {vehicle.year
                                        ? ` | ${vehicle.year}`
                                        : ""}
                                    </p>
                                  </div>
                                  <div className="text-sm sm:text-right">
                                    <p className="font-semibold">
                                      {formatVehiclePrice(vehicle.price)}
                                    </p>
                                    <span
                                      className={`mt-1 inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(
                                        vehicle.status
                                      )}`}
                                    >
                                      {vehicle.status || "Unknown"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a branch to view details.
                    </p>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsBranchDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
      <ChatBot />
      <Footer />
    </div>
  );
}
