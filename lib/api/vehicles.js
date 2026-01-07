// Mock API service for vehicles - simulates backend responses
// This can be easily replaced with real API calls later

const MOCK_VEHICLES = []

// Simulate network delay for realistic loading states
//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const LOCAL_STORAGE_KEY = "customVehicles"

const isBrowser = () => typeof window !== "undefined"

export const vehicleAPI = {
    getAllVehicles: async () => {
        const res = await fetch("/api/vehicles");
        if (!res.ok) {
            return { success: false, error: "Failed to fetch vehicles" };
        }
        const data = await res.json();
        return { success: true, data };
    },

    getVehicleById: async (id) => {
        const res = await fetch(`/api/vehicles/${id}`);
        if (!res.ok) {
            return { success: false, error: "Vehicle not found" };
        }
        const data = await res.json();
        return { success: true, data };
    },

    addVehicle: async (vehicle) => {
        try {
            const res = await fetch("/api/vehicles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vehicle),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                return { success: false, error: errorData.error || "Failed to add vehicle" };
            }

            const data = await res.json();
            return { success: true, data };
        } catch (error) {
            console.error("Error in addVehicle:", error);
            return { success: false, error: "Network error" };
        }
    },
};

const getLocalVehicles = () => {
  if (!isBrowser()) return []
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveLocalVehicles = (vehicles) => {
  if (!isBrowser()) return
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vehicles))
}



const toSortableNumber = (value) => {
  const numberValue = Number(value)
  return Number.isNaN(numberValue) ? 0 : numberValue
}

// export const vehicleAPI = {
//   // Get all vehicles
//   getAllVehicles: async () => {
//     await delay(800) // Simulate API delay
//     return { success: true, data: getAllVehiclesData() }
//   },
//
//   // Get single vehicle by ID
//   getVehicleById: async (id) => {
//     await delay(500)
//     if (!id) {
//       return { success: false, error: "Vehicle not found" }
//     }
//     const normalizedId = String(id)
//     const vehicle = getAllVehiclesData().find((v) => String(v.id) === normalizedId)
//     if (vehicle) {
//       return { success: true, data: vehicle }
//     }
//     return { success: false, error: "Vehicle not found" }
//   },
//
//   // Add a vehicle (stored locally in the browser)
//   addVehicle: async (vehicle) => {
//     await delay(300)
//     if (!vehicle) {
//       return { success: false, error: "Invalid vehicle data" }
//     }
//     const localVehicles = getLocalVehicles()
//     const images = Array.isArray(vehicle.images) ? vehicle.images : []
//     const newVehicle = {
//       ...vehicle,
//       id: vehicle.id ?? Date.now(),
//       name: vehicle.name || `${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""}`.trim(),
//       image: vehicle.image || images[0] || "/placeholder.svg",
//       images,
//       views: vehicle.views ?? 0,
//       createdAt: vehicle.createdAt || new Date().toISOString(),
//     }
//     const updated = [newVehicle, ...localVehicles]
//     saveLocalVehicles(updated)
//     return { success: true, data: newVehicle }
//   },
//
//   // Search and filter vehicles
//   searchVehicles: async (filters = {}) => {
//     await delay(600)
//
//     let results = getAllVehiclesData()
//
//     // Text search (make, model, name)
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase()
//       results = results.filter(
//         (v) =>
//           v.name.toLowerCase().includes(searchLower) ||
//           v.make.toLowerCase().includes(searchLower) ||
//           v.model.toLowerCase().includes(searchLower),
//       )
//     }
//
//     // Location filter
//     if (filters.location && filters.location !== "all") {
//       results = results.filter((v) => v.location.toLowerCase() === filters.location.toLowerCase())
//     }
//
//     // Status filter
//     if (filters.status && filters.status.length > 0) {
//       results = results.filter((v) => filters.status.includes(v.status))
//     }
//
//     // Type filter
//     if (filters.type && filters.type.length > 0) {
//       results = results.filter((v) => filters.type.includes(v.type))
//     }
//
//     // Transmission filter
//     if (filters.transmission && filters.transmission.length > 0) {
//       results = results.filter((v) => filters.transmission.includes(v.transmission))
//     }
//
//     // Price range
//     if (filters.minPrice !== undefined) {
//       results = results.filter((v) => v.price >= filters.minPrice)
//     }
//     if (filters.maxPrice !== undefined) {
//       results = results.filter((v) => v.price <= filters.maxPrice)
//     }
//
//     // Mileage range
//     if (filters.minMileage !== undefined) {
//       results = results.filter((v) => v.mileage >= filters.minMileage)
//     }
//     if (filters.maxMileage !== undefined) {
//       results = results.filter((v) => v.mileage <= filters.maxMileage)
//     }
//
//     // Year range
//     if (filters.minYear !== undefined) {
//       results = results.filter((v) => v.year >= filters.minYear)
//     }
//     if (filters.maxYear !== undefined) {
//       results = results.filter((v) => v.year <= filters.maxYear)
//     }
//
//     // Sorting
//     if (filters.sortBy) {
//       switch (filters.sortBy) {
//         case "price-low":
//           results.sort((a, b) => a.price - b.price)
//           break
//         case "price-high":
//           results.sort((a, b) => b.price - a.price)
//           break
//         case "mileage-low":
//           results.sort((a, b) => a.mileage - b.mileage)
//           break
//         case "mileage-high":
//           results.sort((a, b) => b.mileage - a.mileage)
//           break
//         case "year-new":
//           results.sort((a, b) => b.year - a.year)
//           break
//         case "year-old":
//           results.sort((a, b) => a.year - b.year)
//           break
//         default:
//           results.sort((a, b) => toSortableNumber(b.id) - toSortableNumber(a.id)) // Newest first
//       }
//     }
//
//     return { success: true, data: results, count: results.length }
//   },
//
//   // Get unique filter options
//   getFilterOptions: async () => {
//     await delay(300)
//     return {
//       success: true,
//       data: {
//         locations: ["Nugegoda", "Colombo"],
//         types: ["Sedan", "SUV", "Hatchback", "Van", "Hybrid"],
//         transmissions: ["Automatic", "Manual"],
//         makes: ["Toyota", "Honda", "Suzuki", "BMW"],
//       },
//     }
//   },
// }
