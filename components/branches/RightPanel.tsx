import { useState, useEffect } from "react";
import Image from "next/image";

interface RightPanelProps {
  branch: string;
  brand?: string;
  setViewBranchModel: (value: boolean) => void;
}

export default function RightPanel({
  branch,
  brand,
  setViewBranchModel,
}: RightPanelProps) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch(`/api/branches/branch?branch=${branch || ""}&brand=${brand   || ""}`);
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }

    if (branch) {
      fetchVehicles();
    }
    console.log("Fetched vehicles for branch:", branch, "and brand:", brand);
  }, [branch]);

  return (
    <div className="fixed inset-0 flex justify-end bg-black/40 overflow-auto">
      <div className="bg-white w-96 overflow-y-auto p-6 shadow-xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">{branch}</h2>

          <button className="cursor-pointer" onClick={() => setViewBranchModel(false)}>✕</button>
        </div>

        {/* Vehicle List */}

        {vehicles.map((vehicle: any) => (
          <div key={vehicle?.id} className="border rounded-md p-3 mb-3 grid grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="font-semibold">{vehicle.brand}</h3>
              <h3 className="text-sm text-gray-500">{vehicle.model}</h3>
              <h3 className="text-sm text-gray-500">Year: {vehicle.year}</h3>
              <h3 className="text-sm text-gray-500">
                Mileage: {vehicle.mileage}km
              </h3>

              <p className="text-sm text-gray-500">Price: {vehicle.price}</p>
            </div>
            <div>
              <Image
                src={vehicle.images[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
