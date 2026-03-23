
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
        const data = await res.json();
        return { success: true, data };
    }
};

