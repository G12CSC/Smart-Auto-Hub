"use client";

import { useState } from "react";
import { AdvisorHeader } from "@/components/AdvisorHeader";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Assuming you have this hook based on your file list
import { Loader2, Save } from "lucide-react";

// The specific time slots you requested
const TIME_SLOTS = [
    { id: "slot-1", label: "09.00 - 10.00" },
    { id: "slot-2", label: "10.00 - 11.00" },
    { id: "slot-3", label: "11.00 - 12.00" },
    { id: "slot-4", label: "02.00 - 03.00" },
    { id: "slot-5", label: "03.00 - 04.00" },
    { id: "slot-6", label: "04.00 - 05.00" },
];

export default function AvailabilityPage() {
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isLoading, setIsLoading] = useState(false);

    // State to store selected slots. 
    // In a real app, this would be structured like: { "2024-02-06": ["slot-1", "slot-2"] }
    // For this UI demo, we track the currently selected slots for the *viewed* date.
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate);
        // TODO: Fetch existing availability for this newDate from API
        // For now, we just reset the slots to simulate a fresh day or keep them if you want persistance demo
        // setSelectedSlots([]); 
    };

    const toggleSlot = (slotId: string) => {
        setSelectedSlots((prev) =>
            prev.includes(slotId)
                ? prev.filter((id) => id !== slotId)
                : [...prev, slotId]
        );
    };

    const handleSave = async () => {
        if (!date) {
            toast({
                title: "No date selected",
                description: "Please select a date to set availability.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);
        toast({
            title: "Availability Saved",
            description: `Availability for ${date.toDateString()} has been updated.`,
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* 1. Reuse the Advisor Header */}
            <AdvisorHeader />

            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Availability</h1>
                        <p className="text-muted-foreground mt-2">
                            Select a date and mark your available time slots for customer bookings.
                        </p>
                    </div>

                    {/* MAIN CONTENT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">

                        {/* LEFT COLUMN: TIME SLOTS (As requested) */}
                        <div className="md:col-span-4 order-2 md:order-1">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Available Slots</span>
                                        {date && (
                                            <span className="text-sm font-normal text-muted-foreground">
                                                {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {date ? (
                                            <div className="grid gap-3">
                                                {TIME_SLOTS.map((slot) => (
                                                    <div
                                                        key={slot.id}
                                                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${selectedSlots.includes(slot.id)
                                                                ? "bg-primary/10 border-primary"
                                                                : "hover:bg-muted/50 border-input"
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            id={slot.id}
                                                            checked={selectedSlots.includes(slot.id)}
                                                            onCheckedChange={() => toggleSlot(slot.id)}
                                                        />
                                                        <Label
                                                            htmlFor={slot.id}
                                                            className="flex-1 cursor-pointer font-medium"
                                                        >
                                                            {slot.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 text-muted-foreground">
                                                Please select a date from the calendar to view slots.
                                            </div>
                                        )}

                                        <Button
                                            className="w-full mt-6"
                                            onClick={handleSave}
                                            disabled={!date || isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Availability
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: CALENDAR */}
                        <div className="md:col-span-8 order-1 md:order-2">
                            <Card className="h-full flex flex-col items-center justify-center p-6">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    className="rounded-md border shadow p-4"
                                    classNames={{
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today: "bg-accent text-accent-foreground font-bold"
                                    }}
                                />
                                <div className="mt-6 text-sm text-muted-foreground flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                        <span>Selected</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-accent" />
                                        <span>Today</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
