// Mock API service for vehicles - simulates backend responses
// This can be easily replaced with real API calls later

const MOCK_VEHICLES = [
  {
    id: 1,
    name: "2022 Toyota Prius",
    make: "Toyota",
    model: "Prius",
    year: 2022,
    price: 17500000,
    status: "Available",
    location: "Nugegoda",
    type: "Hybrid",
    mileage: 25000,
    transmission: "Automatic",
    fuelType: "Hybrid",
    image: "/toyota-prius-2022.jpg",
    description: "Excellent condition hybrid vehicle with low mileage.",
  },
  {
    id: 2,
    name: "2021 Honda Civic",
    make: "Honda",
    model: "Civic",
    year: 2021,
    price: 15200000,
    status: "Available",
    location: "Nugegoda",
    type: "Sedan",
    mileage: 35000,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "/honda-civic-2021.jpg",
    description: "Sporty sedan with manual transmission.",
  },
  {
    id: 3,
    name: "2023 Suzuki Swift",
    make: "Suzuki",
    model: "Swift",
    year: 2023,
    price: 12800000,
    status: "Shipped",
    location: "Nugegoda",
    type: "Hatchback",
    mileage: 15000,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "/suzuki-swift-2023.jpg",
    description: "Compact and fuel-efficient hatchback.",
  },
  {
    id: 4,
    name: "2021 Suzuki Wagon R",
    make: "Suzuki",
    model: "Wagon R",
    year: 2021,
    price: 6800000,
    status: "Available",
    location: "Colombo",
    type: "Van",
    mileage: 30000,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "/suzuki-wagon-r-2021.jpg",
    description: "Practical and spacious mini van.",
  },
  {
    id: 5,
    name: "2022 BMW X5",
    make: "BMW",
    model: "X5",
    year: 2022,
    price: 28500000,
    status: "Available",
    location: "Colombo",
    type: "SUV",
    mileage: 18000,
    transmission: "Automatic",
    fuelType: "Diesel",
    image: "/bmw-x5-2022-suv.jpg",
    description: "Luxury SUV with premium features.",
  },
  {
    id: 6,
    name: "2023 Toyota Corolla",
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    price: 13200000,
    status: "Not Available",
    location: "Nugegoda",
    type: "Sedan",
    mileage: 8000,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "/toyota-corolla-2023.png",
    description: "Reliable sedan with modern features.",
  },
]

// Simulate network delay for realistic loading states
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const LOCAL_STORAGE_KEY = "customVehicles"

const isBrowser = () => typeof window !== "undefined"

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

const getAllVehiclesData = () => {
  const localVehicles = getLocalVehicles()
  return [...MOCK_VEHICLES, ...localVehicles]
}

const toSortableNumber = (value) => {
  const numberValue = Number(value)
  return Number.isNaN(numberValue) ? 0 : numberValue
}

export const vehicleAPI = {
  // Get all vehicles
  getAllVehicles: async () => {
    await delay(800) // Simulate API delay
    return { success: true, data: getAllVehiclesData() }
  },

  // Get single vehicle by ID
  getVehicleById: async (id) => {
    await delay(500)
    if (!id) {
      return { success: false, error: "Vehicle not found" }
    }
    const normalizedId = String(id)
    const vehicle = getAllVehiclesData().find((v) => String(v.id) === normalizedId)
    if (vehicle) {
      return { success: true, data: vehicle }
    }
    return { success: false, error: "Vehicle not found" }
  },

  // Add a vehicle (stored locally in the browser)
  addVehicle: async (vehicle) => {
    await delay(300)
    if (!vehicle) {
      return { success: false, error: "Invalid vehicle data" }
    }
    const localVehicles = getLocalVehicles()
    const images = Array.isArray(vehicle.images) ? vehicle.images : []
    const newVehicle = {
      ...vehicle,
      id: vehicle.id ?? Date.now(),
      name: vehicle.name || `${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""}`.trim(),
      image: vehicle.image || images[0] || "/placeholder.svg",
      images,
      views: vehicle.views ?? 0,
      createdAt: vehicle.createdAt || new Date().toISOString(),
    }
    const updated = [newVehicle, ...localVehicles]
    saveLocalVehicles(updated)
    return { success: true, data: newVehicle }
  },

  // Search and filter vehicles
  searchVehicles: async (filters = {}) => {
    await delay(600)

    let results = getAllVehiclesData()

    // Text search (make, model, name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      results = results.filter(
        (v) =>
          v.name.toLowerCase().includes(searchLower) ||
          v.make.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower),
      )
    }

    // Location filter
    if (filters.location && filters.location !== "all") {
      results = results.filter((v) => v.location.toLowerCase() === filters.location.toLowerCase())
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      results = results.filter((v) => filters.status.includes(v.status))
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      results = results.filter((v) => filters.type.includes(v.type))
    }

    // Transmission filter
    if (filters.transmission && filters.transmission.length > 0) {
      results = results.filter((v) => filters.transmission.includes(v.transmission))
    }

    // Price range
    if (filters.minPrice !== undefined) {
      results = results.filter((v) => v.price >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((v) => v.price <= filters.maxPrice)
    }

    // Mileage range
    if (filters.minMileage !== undefined) {
      results = results.filter((v) => v.mileage >= filters.minMileage)
    }
    if (filters.maxMileage !== undefined) {
      results = results.filter((v) => v.mileage <= filters.maxMileage)
    }

    // Year range
    if (filters.minYear !== undefined) {
      results = results.filter((v) => v.year >= filters.minYear)
    }
    if (filters.maxYear !== undefined) {
      results = results.filter((v) => v.year <= filters.maxYear)
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          results.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          results.sort((a, b) => b.price - a.price)
          break
        case "mileage-low":
          results.sort((a, b) => a.mileage - b.mileage)
          break
        case "mileage-high":
          results.sort((a, b) => b.mileage - a.mileage)
          break
        case "year-new":
          results.sort((a, b) => b.year - a.year)
          break
        case "year-old":
          results.sort((a, b) => a.year - b.year)
          break
        default:
          results.sort((a, b) => toSortableNumber(b.id) - toSortableNumber(a.id)) // Newest first
      }
    }

    return { success: true, data: results, count: results.length }
  },

  // Get unique filter options
  getFilterOptions: async () => {
    await delay(300)
    return {
      success: true,
      data: {
        locations: ["Nugegoda", "Colombo"],
        types: ["Sedan", "SUV", "Hatchback", "Van", "Hybrid"],
        transmissions: ["Automatic", "Manual"],
        makes: ["Toyota", "Honda", "Suzuki", "BMW"],
      },
    }
  },
}
