
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";

import AddVehicleForm from "./forms/AddVehicleForm";
export default function AddVehicle() {

    const { isAddVehicleOpen, setIsAddVehicleOpen, setVehicleFormError } = useVehicles();
    return (
        <>
            <Dialog
                open={isAddVehicleOpen}
                onOpenChange={(open) => {
                    setIsAddVehicleOpen(open);
                    if (!open) {
                        setVehicleFormError("");
                    }
                }}
            >
                <DialogTrigger asChild>
                    <Button>
                        <Plus size={18} className="mr-2" />
                        Add New Vehicle
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Vehicle</DialogTitle>
                    </DialogHeader>

                    <AddVehicleForm />
                </DialogContent>
            </Dialog>
        </>
    );
}