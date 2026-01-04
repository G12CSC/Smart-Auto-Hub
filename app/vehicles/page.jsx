"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  GitCompareArrows,
  GitCompareArrowsIcon,
  GitCompareIcon,
  Grid3x3,
  Heart,
  List,
  Loader2,
  MessageSquare,
} from "lucide-react";
import ChatBot from "@/components/ChatBot";
import { addToCompare } from "@/components/VehicleCompare";
import { vehicleAPI } from "../../lib/api/vehicles";
import { localStorageAPI } from "@/lib/storage/localStorage.js";
import { toast } from "sonner";
import { VehicleCompare } from "@/components/VehicleCompare";
import { VehicleSkeleton } from "@/components/VehicleSkeleton";

export default function VehiclesPage() {

  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const vehiclesPerPage = 4;

  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState({
    Available: true,
    Shipped: true,
    "Not Available": true,
  });
  const [filterType, setFilterType] = useState({
    Sedan: true,
    SUV: true,
    Hatchback: true,
    Van: true,
    Hybrid: true,
  });
  const [filterTransmission, setFilterTransmission] = useState({
    Automatic: true,
    Manual: true,
  });

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000000);
  const [minMileage, setMinMileage] = useState(0);
  const [maxMileage, setMaxMileage] = useState(50000);

  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "all";
  //get user entering values

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationFilter, setLocationFilter] = useState(initialLocation);

  const [favourites, setFavourites] = useState([]);

  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchVehicles = async () => {

      setLoading(true);

      try{

          const res=await fetch("/api/vehicles");
          //getting the response from that api endpoint with all the car details

          const data=await res.json();

          setVehicles(Array.isArray(data) ? data : []);

          const filters = {
              search: searchQuery,
              location: locationFilter,
              status: Object.keys(filterStatus).filter((key) => filterStatus[key]),
              type: Object.keys(filterType).filter((key) => filterType[key]),
              transmission: Object.keys(filterTransmission).filter(
                  (key) => filterTransmission[key]
              ),
              minPrice,
              maxPrice,
              minMileage,
              maxMileage,
              sortBy,
          };


      }
      catch(err){

          setError(err.message);

      } finally {
          setLoading(false);
      }

    };

      fetchVehicles();

  }, []);

  useEffect(() => {
    setFavourites(localStorageAPI.getFavourites());
    const prefs = localStorageAPI.getPreferences();
    setViewMode(prefs.viewMode || "grid");
  }, []);

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;
  const currentVehicles = vehicles.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [vehicles.length]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setFilterStatus({ Available: true, Shipped: true, "Not Available": true });
    setFilterType({
      Sedan: true,
      SUV: true,
      Hatchback: true,
      Van: true,
      Hybrid: true,
    });
    setFilterTransmission({ Automatic: true, Manual: true });
    setMinPrice(0);
    setMaxPrice(30000000);
    setMinMileage(0);
    setMaxMileage(50000);
    setSortBy("newest");
  };

  const toggleFavourite = (e, vehicleId) => {
    e.preventDefault();
    e.stopPropagation();

    if (localStorageAPI.isFavourite(vehicleId)) {
      const updated = localStorageAPI.removeFavourite(vehicleId);
      setFavourites(updated);
    } else {
      const updated = localStorageAPI.addFavourite(vehicleId);
      setFavourites(updated);
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorageAPI.setPreference("viewMode", mode);
  };

  const handleAddToCompare = (e, vehicle) => {
    e.preventDefault();
    e.stopPropagation();

    const result = addToCompare(vehicle);

    if (result.success) {
      toast.success(`${vehicle.name} added to comparison`);
      // Force re-render of VehicleCompare component
      window.dispatchEvent(new Event("storage"));
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="relative h-96 bg-linear-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center mb-24"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=384&width=1600&query=modern car showroom inventory luxury vehicles)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-6xl font-bold mb-4 text-balance">
            Find Your Perfect Car
          </h1>
          <p className="text-xl opacity-90 text-balance max-w-2xl">
            Browse our extensive inventory of quality vehicles. From sedans to
            SUVs, we have something for everyone.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* <h1 className="text-4xl font-bold mb-8">Search Our Inventory</h1> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            {/* <div className="bg-card rounded-lg p-6 border border-border sticky top-24"> */}
            <div className="bg-card rounded-lg p-6 border border-border sticky top-24 shadow-sm hover:shadow-md transition">
              <h2 className="font-bold text-xl mb-6">Filters</h2>

              {/* Search Input */}
              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Make, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Locations</option>
                  <option value="nugegoda">Nugegoda</option>
                  <option value="jpura">Jayawardanapura</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">Availability</h3>
                {["Available", "Shipped", "Not Available"].map((status) => (
                  // <label key={status} className="flex items-center gap-3 mb-3 cursor-pointer">
                  <label
                    key={status}
                    className="flex items-center gap-3 mb-2 cursor-pointer hover:text-primary transition"
                  >
                    <input
                      type="checkbox"
                      checked={filterStatus[status]}
                      onChange={(e) =>
                        setFilterStatus({
                          ...filterStatus,
                          [status]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">Vehicle Type</h3>
                {["Sedan", "SUV", "Hatchback", "Van", "Hybrid"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 mb-2 cursor-pointer hover:text-primary transition"
                  >
                    <input
                      type="checkbox"
                      checked={filterType[type]}
                      onChange={(e) =>
                        setFilterType({
                          ...filterType,
                          [type]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>

              {/* Transmission Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">Transmission</h3>
                {["Automatic", "Manual"].map((trans) => (
                  <label
                    key={trans}
                    className="flex items-center gap-3 mb-2 cursor-pointer hover:text-primary transition"
                  >
                    <input
                      type="checkbox"
                      checked={filterTransmission[trans]}
                      onChange={(e) =>
                        setFilterTransmission({
                          ...filterTransmission,
                          [trans]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm">{trans}</span>
                  </label>
                ))}
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Min: LKR {minPrice.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30000000"
                      step="1000000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Max: LKR {maxPrice.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30000000"
                      step="1000000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Mileage Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">
                  Mileage Range (km)
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Min: {minMileage.toLocaleString()} km
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="5000"
                      value={minMileage}
                      onChange={(e) => setMinMileage(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Max: {maxMileage.toLocaleString()} km
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="5000"
                      value={maxMileage}
                      onChange={(e) => setMaxMileage(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="w-full bg-transparent"
              >
                Reset All Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 bg-secondary/10 rounded-lg px-6 py-4">
              <p className="text-muted-foreground font-semibold">
                {loading ? "Loading..." : `Showing ${vehicles.length} vehicles`}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 mr-4">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => toggleViewMode("grid")}
                    className="px-3"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => toggleViewMode("list")}
                    className="px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <label className="text-sm font-semibold">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="mileage-low">Mileage: Low to High</option>
                  <option value="mileage-high">Mileage: High to Low</option>
                  <option value="year-new">Year: Newest First</option>
                  <option value="year-old">Year: Oldest First</option>
                </select>
              </div>
            </div>

              {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[...Array(6)].map((_, index) => (
                          <VehicleSkeleton key={index} />
                      ))}
                  </div>
              ) : currentVehicles.length === 0 ? (
                  <div className="text-center py-20">
                      <p className="text-xl text-muted-foreground mb-4">
                          No vehicles found matching your criteria
                      </p>
                      <Button onClick={handleResetFilters}>Reset Filters</Button>
                  </div>
              ) : (
                  <div
                      className={
                          viewMode === "grid"
                              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                              : "space-y-4"
                      }
                  >
                      {currentVehicles.map((vehicle, index) => (
                          <div
                              key={vehicle.id}
                              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
                              style={{
                                  opacity: 0,
                                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                              }}
                          >
                              <Link
                                  href={`/vehicles/${vehicle.id}`}
                                  className={`block ${
                                      viewMode === "list" ? "flex gap-4" : ""
                                  }`}
                              >
                                  {/* IMAGE */}
                                  <div
                                      className={`relative bg-muted overflow-hidden ${
                                          viewMode === "grid" ? "h-56" : "w-64 h-48"
                                      }`}
                                  >
                                      <img
                                          src={vehicle.images?.[0] || "/placeholder-car.png"}
                                          alt={`${vehicle.brand} ${vehicle.model}`}
                                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                      />

                                      {/* Favourite */}
                                      <button
                                          onClick={(e) => toggleFavourite(e, vehicle.id)}
                                          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 hover:bg-white"
                                      >
                                          <Heart
                                              className={`w-5 h-5 ${
                                                  favourites.includes(vehicle.id)
                                                      ? "fill-red-500 text-red-500"
                                                      : "text-gray-600"
                                              }`}
                                          />
                                      </button>

                                      {/* Compare */}
                                      <button
                                          onClick={(e) => handleAddToCompare(e, vehicle)}
                                          className="absolute bottom-4 right-4 p-2 rounded-full bg-primary text-white"
                                          title="Add to Compare"
                                      >
                                          <GitCompareArrows className="w-5 h-5" />
                                      </button>
                                  </div>

                                  {/* DETAILS */}
                                  <div className="p-5 flex-1">
                                      <h3 className="font-bold text-lg mb-1 hover:text-primary transition">
                                          {vehicle.brand} {vehicle.model}
                                      </h3>

                                      <p className="text-muted-foreground text-sm mb-2">
                                          {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                                      </p>

                                      <p className="text-primary font-bold text-xl mb-3">
                                          LKR {vehicle.price.toLocaleString()}
                                      </p>

                                      <div className="text-sm text-muted-foreground space-y-1">
                                          <p>
                                              {vehicle.location || "Location N/A"} •{" "}
                                              {vehicle.transmission || "N/A"} •{" "}
                                              {vehicle.fuelType || "N/A"}
                                          </p>
                                      </div>
                                  </div>
                              </Link>
                          </div>
                      ))}
                  </div>
              )}

              {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>

                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        className="w-10"
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                )}
          </div>
        </div>
      </div>

      {/* VehicleCompare sticky bar */}
      <VehicleCompare />

      {/* Chatbot Icon */}
      <ChatBot />

      <Footer />
    </div>
  );
}
