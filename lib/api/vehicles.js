// Mock API service for vehicles - simulates backend responses
// This can be easily replaced with real API calls later

const MOCK_VEHICLES = []

// Simulate network delay for realistic loading states
//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const LOCAL_STORAGE_KEY = "customVehicles"

const isBrowser = () => typeof window !== "undefined"

export const vehicleAPI = {
    getAllVehicles: async () => {
        const res = await fetch("/api/admin/vehicles");
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
        const res = await fetch("/api/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicle),
        });
        if (!res.ok) {
            return { success: false, error: "Failed to add vehicle" };
        }
        revalidatePath("/admin");
        const data = await res.json();
        return { success: true, data };
    }
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


