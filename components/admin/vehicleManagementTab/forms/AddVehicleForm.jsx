import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useVehicles } from "@/hooks/useVehicles";

export default function AddVehicleForm() {
    const { setIsAddVehicleOpen, vehicleForm, handleVehicleFieldChange, handleAddVehicle } = useVehicles();
    return (
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
    );
}