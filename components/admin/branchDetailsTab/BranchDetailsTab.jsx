"use client";

import { useBranchInventory } from "@/hooks/useBranchInventory";
import { fetchJSON } from "@/services/api";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import RightPanel from "@/components/branches/RightPanel";
import { useState, useEffect } from "react";

export default function BranchDetailsTab() {
    const { branchInventory, setBranchInventory } = useBranchInventory();
    const [viewBranchModel, setViewBranchModel] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);

    const handleBranchInventory = async () => {
        const branchInventory = await fetchJSON("/api/branches");
        console.log("Branch Inventory:", branchInventory);
        setBranchInventory(branchInventory);
    };

    useEffect(() => {
        handleBranchInventory();
    }, []);

    return (
        <>
            <div>
                <h2 className="text-2xl font-bold mb-6">Branch-wise Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(branchInventory).map(([branch, vehicles]) => (
                        <div key={branch} className="bg-white dark:bg-black/50 rounded-lg border border-border p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <MapPin size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{branch}</h3>
                                    <p className="text-sm text-muted-foreground">Branch</p>
                                </div>
                            </div>
                            {vehicles.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No vehicles in this branch.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            Total Vehicles
                                        </span>
                                        <span className="font-bold text-lg">
                                            {vehicles.length}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* List of vehicles brands only */}
                                        {Array.from(new Set(vehicles.map((v) => v.brand))).map((brand) => (
                                            <div key={brand} className="flex justify-between items-center border border-border rounded cursor-pointer hover:bg-red-50 px-3 py-2 dark:hover:text-black" onClick={() => {
                                                setSelectedBrand(brand);
                                                setViewBranchModel(true);
                                            }}>
                                                <span className="text-sm text-muted-foreground">{brand}</span>
                                                <span className="font-bold">{vehicles.filter((v) => v.brand === brand).length}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="max-h-48 overflow-y-auto">
                                        <Button onClick={() => {
                                            setSelectedBrand(null);
                                            setViewBranchModel(true);
                                        }
                                        } className="w-full mt-4 cursor-pointer" variant="outline">
                                            View Details
                                        </Button>

                                    </div>
                                    {
                                        viewBranchModel && (
                                            <>
                                                <RightPanel branch={branch} brand={selectedBrand} setViewBranchModel={setViewBranchModel} />
                                            </>
                                        )
                                    }
                                </div>
                            )
                            }
                        </div>
                    ))
                    }
                </div>
            </div>
        </>
    )
}