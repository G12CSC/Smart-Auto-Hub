import { fetchJSON } from "@/services/api";
import { vehicleAPI } from "@/lib/api/vehicles.js";
import { useState } from "react";
import { toast } from "sonner";

const vehicleFormDefaults = {
  brand: "",
  model: "",
  year: "",
  type: "",
  mileage: "",
  transmission: "",
  fuelType: "",
  branch: "Nugegoda",
  bodyType: "",
  engineCapacity: "",
  location: "",
  condition: "New",
  dealer: "",
  price: "",
  description: "",
  images: "",
  status: "Available",
  edition: "",
};

export const useVehicles = () => {
  const [adminVehicles, setAdminVehicles] = useState([]);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);
  const [vehicleFormError, setVehicleFormError] = useState("");
  const [vehicleForm, setVehicleForm] = useState(vehicleFormDefaults);
  const [editingVehicle, setEditingVehicle] = useState<null | any>(null);
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const data = await fetchJSON(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
      });
      if (data.success) {
        toast.success("Vehicle deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete vehicle");
    }
  };

  const loadVehicles = async () => {
    try {
      const result = await vehicleAPI.getAllVehicles();
      if (result.success) {
        const sortedVehicles = [...result.data].sort(
          (a, b) => Number(b.id) - Number(a.id),
        );
        setAdminVehicles(sortedVehicles);
      }
    } catch (error) {
      console.error("Failed to load vehicles", error);
    }
  };

  const handleAddVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingVehicle(true);
    setVehicleFormError("");

    // Validation
    if (
      !vehicleForm.brand?.trim() ||
      !vehicleForm.model?.trim() ||
      !vehicleForm.year ||
      !vehicleForm.price
    ) {
      setVehicleFormError("Please fill required fields.");
      setIsSavingVehicle(false);
      return;
    }

    // Convert images string → array
    const images =
      vehicleForm.images
        ?.split(/,|\n/)
        .map((value) => value.trim())
        .filter(Boolean) || [];

    const newVehicle = {
      brand: vehicleForm.brand.trim(),
      model: vehicleForm.model.trim(),
      year: Number(vehicleForm.year),
      price: Number(vehicleForm.price),
      mileage: Number(vehicleForm.mileage) || 0,
      transmission: vehicleForm.transmission?.trim() || null,
      fuelType: vehicleForm.fuelType?.trim() || null,
      bodyType: vehicleForm.bodyType?.trim() || null,
      engineCapacity: vehicleForm.engineCapacity
        ? Number(vehicleForm.engineCapacity)
        : null,
      location: vehicleForm.location?.trim() || null,
      dealer: vehicleForm.dealer?.trim() || null,
      condition: vehicleForm.condition || null,
      edition: vehicleForm.edition || null,
      images,
    };

    try {
      const result = await vehicleAPI.addVehicle(newVehicle);

      if (result.success) {
        await loadVehicles();
        setVehicleForm(vehicleFormDefaults);
        setIsAddVehicleOpen(false);
        toast.success("Vehicle added successfully");
      } else {
        setVehicleFormError(result.error || "Failed to add vehicle.");
        toast.error(result.error || "Failed to add vehicle.");
      }
    } catch (error) {
      setVehicleFormError("Something went wrong.");
    }

    setIsSavingVehicle(false);
  };

  const handleEditVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const images = vehicleForm.images
      .toString()
      .split(/,|\n/)
      .map((value) => value.trim())
      .filter(Boolean);

    const updatedVehicle = {
      brand: vehicleForm.brand,
      model: vehicleForm.model,
      year: Number(vehicleForm.year),
      price: Number(vehicleForm.price),
      mileage: Number(vehicleForm.mileage),
      transmission: vehicleForm.transmission,
      fuelType: vehicleForm.fuelType,
      bodyType: vehicleForm.bodyType,
      location: vehicleForm.location,
      images,
    };
    console.log("UpdatedVehicle:", updatedVehicle);
    const id = editingVehicle.id;
    console.log("Vehicle ID:", id);
    const res = await fetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedVehicle),
    });

    if (res.ok) {
      await loadVehicles();
      setIsEditVehicleOpen(false);
      toast.success("Vehicle updated successfully");
    } else {
      setIsEditVehicleOpen(false);
      toast.error("Failed to update vehicle");
    }
  };

  const openEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setVehicleForm(vehicle); 
    setIsEditVehicleOpen(true);
  };

  return {
    adminVehicles,
    handleDeleteVehicle,
    handleAddVehicle,
    loadVehicles,
    isAddVehicleOpen,
    setIsAddVehicleOpen,
    isSavingVehicle,
    vehicleFormError,
    setVehicleFormError,
    vehicleForm,
    setVehicleForm,
    isEditVehicleOpen,
    setIsEditVehicleOpen,
    handleEditVehicle,
    openEditVehicle,
  };
};
