"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Vehicle = {
  id: number | string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  images?: string[];
  image?: string;
  location?: string;
  transmission?: string;
  fuelType?: string;
  name?: string;
};

type VehicleBrowserProps = {
  initialVehicles?: Vehicle[];
  initialError?: string | null;
};

export default function VehicleBrowser({
  initialVehicles = [],
  initialError = null,
}: VehicleBrowserProps) {
  const [loading, setLoading] = useState(false);
  const vehiclesPerPage = 6;

  const [vehicles, setVehicles] = useState<Vehicle[]>(
    Array.isArray(initialVehicles) ? initialVehicles : [],
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;
  const currentVehicles = vehicles.slice(startIndex, endIndex);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000000);
  //const [minMileage, setMinMileage] = useState(0);
  const [maxMileage, setMaxMileage] = useState(2000000);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [filterTransmission, setFilterTransmission] = useState<
    Record<string, boolean>
  >({
    Automatic: true,
    Manual: true,
  });

  const handleResetFilters = () => {
    setBrand("");
    setModel("");
    setMaxMileage(50000);
  };

  //UseEffects()

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (brand) params.append("brand", brand);
        if (model) params.append("model", model);

        //if (minMileage > 0) params.append("minMileage", String(minMileage));
        if (maxMileage < 200000)
          params.append("maxMileage", String(maxMileage));

        if (minPrice > 0) params.append("minPrice", String(minPrice));
        if (maxPrice < 30000000) params.append("maxPrice", String(maxPrice));

        const res = await fetch(`/api/vehicles?${params.toString()}`);

        const data = await res.json();

        setVehicles(data);
      } catch (err) {
        console.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [brand, model, maxMileage, minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [vehicles.length]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 border border-border sticky top-28 shadow-sm hover:shadow-md transition animate-slide-in-left">
            <h2 className="font-bold text-xl mb-6">Filters</h2>

            {/* Search Input */}
            {/* Brand */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">Make</label>
              <input
                type="text"
                placeholder="Toyota, BMW..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border"
              />
            </div>

            {/* Model */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">Model</label>
              <input
                type="text"
                placeholder="Corolla, Civic..."
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border"
              />
            </div>

            {/* Mileage */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">
                Mileage Range
              </label>

              <div className="flex justify-between text-sm mb-2">
                <span>{maxMileage.toLocaleString()} km</span>
              </div>

              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={maxMileage}
                onChange={(e) => setMaxMileage(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            {/* priceRange */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">
                Price Range
              </label>

              <div className="flex justify-between text-sm mb-2">
                <span>LKR {minPrice.toLocaleString()}</span>
                <span>LKR {maxPrice.toLocaleString()}</span>
              </div>

              <input
                type="range"
                min="0"
                max="30000000"
                step="50000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full"
              />

              <input
                type="range"
                min="0"
                max="30000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="w-full mt-4"
            >
              Reset Filters
            </Button>
          </div>
        </div>
        <div className="lg:col-span-3">
          {loading ? (
            <p>Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <p>No vehicles found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentVehicles.map((vehicle) => (
                <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                  <div className="border rounded-lg p-4 hover:shadow-lg transition">
                    <img
                      src={vehicle.images?.[0] || "/placeholder-car.png"}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-48 object-cover rounded"
                    />

                    <h3 className="font-bold mt-3">
                      {vehicle.brand} {vehicle.model}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                    </p>

                    <p className="font-bold text-primary">
                      LKR {vehicle.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              variant="outline"
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
