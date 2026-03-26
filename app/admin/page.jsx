"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RightPanel from "@/components/branches/RightPanel";

import { Eye, Edit, Trash2, Users,
  Car, Mail, MapPin, FileText, Video,
  Plus, UserCog, LogOut,
  Sun, Moon, CircleX
} from "lucide-react";

import { useVehicles } from "@/hooks/useVehicles";
import { useBranchInventory } from "@/hooks/useBranchInventory";
import { useAdminRequest } from "@/hooks/useAdminRequest";
import { useVideo } from "@/hooks/useVideo";

import NewsletterTab from "../../components/admin/newsletterTab/NewsletterTab.jsx";
import ChatBot from "@/components/ChatBot";
import { useTheme } from "next-themes";
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
import { localStorageAPI } from "@/lib/storage/localStorage";
import AdvisorSelectionModal from "@/components/advisor-selection-modal";
import { fetchJSON } from "@/services/api.ts";
import BookingTab from "@/components/admin/consultationBooking/BookingTab.jsx";
import AdvisorTab from "@/components/admin/advisorTab/AdvisorTab.jsx";
import VideoReviewTab from "@/components/admin/videoReviewTab/VideoReviewTab.jsx";
import TransactionTab from "@/components/admin/transactionTab/TransactionTab.jsx";

export default function AdminPage() {
  const { data: session } = useSession();
  const {
    adminVehicles, handleDeleteVehicle,
    loadVehicles, handleAddVehicle,
    isAddVehicleOpen, setIsAddVehicleOpen,
    setVehicleFormError,
    vehicleForm, setVehicleForm,
    handleEditVehicle, openEditVehicle
  } = useVehicles();
  const { loadVideos } = useVideo();
  const {branchInventory, setBranchInventory} = useBranchInventory();
  const { newsletterSubscribers, totalVehicles, pendingRequests } = useAdminRequest();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("requests");

  const [recentRequests, setRecentRequests] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [selectedRequestForAdvisor, setSelectedRequestForAdvisor] = useState(null);
  const [viewBranchModel, setViewBranchModel] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);

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
      const data = await fetchJSON("/api/Consultations/getAllBooking");
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

  const handleBranchInventory = async () => {
    // This function can be expanded to fetch and display inventory for each branch
    const branchInventory = await fetchJSON("/api/branches");
    console.log("Branch Inventory:", branchInventory);
    setBranchInventory(branchInventory);
  };

  const handleVehicleFieldChange = (field, value) => {
    setVehicleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [notifications, setNotifications] = useState({
    requests: 0,
    vehicles: 0,
    videos: 0,
    newsletter: 0,
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const notifs = localStorageAPI.getNotifications();
        setNotifications(notifs.admin);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
    fetchBookings();
    loadVehicles();
    loadVideos();
    handleBranchInventory();
  }, []);


  const handleTabChange = (tabId) => {
    try {
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
    }
    catch (error) {
      console.error("Failed to update notifications", error);
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
            <BookingTab 
              recentRequests={recentRequests}
              fetchBookings={fetchBookings}
              setSelectedRequestForAdvisor={setSelectedRequestForAdvisor}
              setIsAdvisorModalOpen={setIsAdvisorModalOpen}
            />
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
                            className="w-full border rounded-md px-3 py-2 dark:bg-[#0f090b]"
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
                            onClick={() => {
                              openEditVehicle(vehicle);
                              setIsEditVehicleOpen(true);

                            }}
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
            <VideoReviewTab />
          )}

          {/* Newsletter Tab */}
          {activeTab === "newsletter" && (
            <NewsletterTab />
          )}

          {activeTab === "advisors" && (
            <AdvisorTab />
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
            <TransactionTab />
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
    </div>
  );
}
