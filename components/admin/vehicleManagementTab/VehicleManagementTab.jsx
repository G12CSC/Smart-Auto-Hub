
import AddVehicle from "./AddVehicle";
import VehicleList from "./VehicleList";

export default function VehicleManagementTab() {

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Vehicle Management</h2>
                <div>
                    <AddVehicle />
                </div>
            </div>

            <div className="mt-8">
                <VehicleList />
            </div>
        </div>
    );
}