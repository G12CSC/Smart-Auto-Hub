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
const LOCAL_STORAGE_OVERRIDES_KEY = "vehicleOverrides"
const LOCAL_STORAGE_DELETED_KEY = "deletedVehicleIds"

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

const getLocalOverrides = () => {
  if (!isBrowser()) return []
  const stored = localStorage.getItem(LOCAL_STORAGE_OVERRIDES_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const getDeletedVehicleIds = () => {
  if (!isBrowser()) return []
  const stored = localStorage.getItem(LOCAL_STORAGE_DELETED_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveLocalVehicles = (vehicles) => {
  if (!isBrowser()) {
    return { success: false, error: "Storage is not available." }
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vehicles))
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

const saveLocalOverrides = (vehicles) => {
  if (!isBrowser()) {
    return { success: false, error: "Storage is not available." }
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_OVERRIDES_KEY, JSON.stringify(vehicles))
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

const saveDeletedVehicleIds = (ids) => {
  if (!isBrowser()) {
    return { success: false, error: "Storage is not available." }
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(ids))
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

const getAllVehiclesData = () => {
  const localVehicles = getLocalVehicles()
  const overrides = getLocalOverrides()
  const deletedIds = new Set(getDeletedVehicleIds().map(String))
  const baseVehicles = [...MOCK_VEHICLES, ...localVehicles].filter(
    (vehicle) => !deletedIds.has(String(vehicle.id)),
  )
  const overridesById = new Map(
    overrides.map((vehicle) => [String(vehicle.id), vehicle]),
  )

  return baseVehicles.map(
    (vehicle) => overridesById.get(String(vehicle.id)) || vehicle,
  )
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
    const saveResult = saveLocalVehicles(updated)
    if (!saveResult.success) {
      return {
        success: false,
        error:
          "Storage limit reached. Please remove some images or use smaller files.",
      }
    }
    return { success: true, data: newVehicle }
  },

  // Update a vehicle (local overrides for mock data)
  updateVehicle: async (id, updates) => {
    await delay(300)
    if (!id) {
      return { success: false, error: "Vehicle not found" }
    }
    if (!updates || typeof updates !== "object") {
      return { success: false, error: "Invalid vehicle data" }
    }

    const normalizedId = String(id)
    const deletedIds = new Set(getDeletedVehicleIds().map(String))
    if (deletedIds.has(normalizedId)) {
      return { success: false, error: "Vehicle not found" }
    }

    const localVehicles = getLocalVehicles()
    const localIndex = localVehicles.findIndex((v) => String(v.id) === normalizedId)
    const existing = getAllVehiclesData().find((v) => String(v.id) === normalizedId)
    if (!existing) {
      return { success: false, error: "Vehicle not found" }
    }

    const nextImages = Array.isArray(updates.images)
      ? updates.images
      : Array.isArray(existing.images)
        ? existing.images
        : []

    const updatedVehicle = {
      ...existing,
      ...updates,
      id: existing.id,
      image: updates.image || nextImages[0] || existing.image || "/placeholder.svg",
      images: nextImages.length > 0 ? nextImages : existing.images || [],
      updatedAt: new Date().toISOString(),
    }

    if (localIndex >= 0) {
      const updatedLocal = [...localVehicles]
      updatedLocal[localIndex] = updatedVehicle
      const saveResult = saveLocalVehicles(updatedLocal)
      if (!saveResult.success) {
        return {
          success: false,
          error:
            "Storage limit reached. Please remove some images or use smaller files.",
        }
      }
      return { success: true, data: updatedVehicle }
    }

    const overrides = getLocalOverrides()
    const overrideIndex = overrides.findIndex((v) => String(v.id) === normalizedId)
    const updatedOverrides =
      overrideIndex >= 0
        ? overrides.map((vehicle, index) =>
            index === overrideIndex ? updatedVehicle : vehicle,
          )
        : [updatedVehicle, ...overrides]
    const saveOverrideResult = saveLocalOverrides(updatedOverrides)
    if (!saveOverrideResult.success) {
      return {
        success: false,
        error:
          "Storage limit reached. Please remove some images or use smaller files.",
      }
    }

    return { success: true, data: updatedVehicle }
  },

  // Delete a vehicle (local delete markers for mock data)
  deleteVehicle: async (id) => {
    await delay(300)
    if (!id) {
      return { success: false, error: "Vehicle not found" }
    }

    const normalizedId = String(id)
    const localVehicles = getLocalVehicles()
    const localIndex = localVehicles.findIndex((v) => String(v.id) === normalizedId)
    if (localIndex >= 0) {
      const updatedLocal = localVehicles.filter((v) => String(v.id) !== normalizedId)
      const saveResult = saveLocalVehicles(updatedLocal)
      if (!saveResult.success) {
        return {
          success: false,
          error:
            "Storage limit reached. Please remove some images or use smaller files.",
        }
      }
      return { success: true }
    }

    const existing = getAllVehiclesData().find((v) => String(v.id) === normalizedId)
    if (!existing) {
      return { success: false, error: "Vehicle not found" }
    }

    const deletedIds = new Set(getDeletedVehicleIds().map(String))
    deletedIds.add(normalizedId)
    const saveDeletedResult = saveDeletedVehicleIds(Array.from(deletedIds))
    if (!saveDeletedResult.success) {
      return { success: false, error: "Unable to delete vehicle." }
    }

    const overrides = getLocalOverrides().filter(
      (vehicle) => String(vehicle.id) !== normalizedId,
    )
    saveLocalOverrides(overrides)

    return { success: true }
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
