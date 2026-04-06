
import { Car, Edit, Eye, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useVehicles } from "@/hooks/useVehicles";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VehicleList() {
    const {
        adminVehicles,
        isEditVehicleOpen,
        vehicleForm,
        setVehicleForm,
        handleEditVehicle,
        openEditVehicle,
        handleDeleteVehicle,
        setIsEditVehicleOpen
    } = useVehicles();

    const handleVehicleFieldChange = (field, value) => {
        setVehicleForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    return (
        <>
            {adminVehicles.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No vehicles available yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {adminVehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-24 bg-secondary rounded flex items-center justify-center overflow-hidden">
                                    {vehicle.images && vehicle.images.length > 0 ? (
                                        <img
                                            src={vehicle.images[0]}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Car size={32} className="text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {vehicle.location || vehicle.branch || "N/A"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={14} />
                                            {vehicle.views ?? 0} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        {typeof vehicle.price === "number"
                                            ? `LKR ${vehicle.price.toLocaleString()}`
                                            : vehicle.price}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            openEditVehicle(vehicle);
                                            setIsEditVehicleOpen(true);

                                        }}
                                    >
                                        <Edit size={16} />
                                    </Button>
                                    <Dialog open={isEditVehicleOpen} onOpenChange={setIsEditVehicleOpen} className="bg-transparent">
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">

                                            <DialogHeader>
                                                <DialogTitle>Edit Vehicle</DialogTitle>
                                            </DialogHeader>

                                            <form onSubmit={handleEditVehicle} className="space-y-4">

                                                <Input
                                                    value={vehicleForm.brand}
                                                    onChange={(e) => handleVehicleFieldChange("brand", e.target.value)}
                                                    placeholder="Brand"
                                                />

                                                <Input
                                                    value={vehicleForm.model}
                                                    onChange={(e) => handleVehicleFieldChange("model", e.target.value)}
                                                    placeholder="Model"
                                                />

                                                <Input
                                                    type="number"
                                                    value={vehicleForm.year}
                                                    onChange={(e) => handleVehicleFieldChange("year", e.target.value)}
                                                />

                                                <Input
                                                    type="number"
                                                    value={vehicleForm.price}
                                                    onChange={(e) => handleVehicleFieldChange("price", e.target.value)}
                                                />

                                                <Textarea
                                                    value={vehicleForm.images}
                                                    onChange={(e) => handleVehicleFieldChange("images", e.target.value)}
                                                />

                                                <DialogFooter>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setIsEditVehicleOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>

                                                    <Button type="submit">
                                                        Update Vehicle
                                                    </Button>
                                                </DialogFooter>

                                            </form>

                                        </DialogContent>
                                    </Dialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost">
                                                <Trash2 size={16} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete Vehicle
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete "
                                                    {vehicle.name}"? This action can not be
                                                    undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="flex justify-end gap-3">
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDeleteVehicle(vehicle.id)
                                                    }
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}