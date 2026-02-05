"use client";

import { useState, useEffect } from "react";
import { getAdvisorAvailability, saveAdvisorAvailability } from "@/app/advisor-dashboard/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AdvisorAvailabilityProps {
    advisorId: string;
}

// Hardcoded slots as per requirements
const AVAILABLE_TIME_SLOTS = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
];

export function AdvisorAvailability({ advisorId }: AdvisorAvailabilityProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Generate next 30 days
    const days = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            const res = await getAdvisorAvailability(advisorId, selectedDate);
            if (res.success) {
                // Filter to ensure we only show valid slots if the DB has others
                const validSlots = (res.data || []).filter(slot => AVAILABLE_TIME_SLOTS.includes(slot));
                setSelectedSlots(validSlots);
            }
            setLoading(false);
        };
        fetchAvailability();
    }, [advisorId, selectedDate]);

    const handleSlotToggle = (slot: string) => {
        setSelectedSlots((prev) =>
            prev.includes(slot)
                ? prev.filter((s) => s !== slot)
                : [...prev, slot]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await saveAdvisorAvailability(advisorId, selectedDate, selectedSlots);
        setSaving(false);

        if (res.success) {
            toast.success("Availability saved successfully");
        } else {
            toast.error("Failed to save availability");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-slideInUp">
            {/* Left Column: Scrollable Date List */}
            <div className="md:col-span-5 lg:col-span-4">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Select Date</CardTitle>
                        <CardDescription>Next 30 Days</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[500px] overflow-y-auto px-4 pb-4">
                            <div className="space-y-2">
                                {days.map((date) => {
                                    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                                    return (
                                        <button
                                            key={date.toISOString()}
                                            onClick={() => setSelectedDate(date)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-md border transition-all text-left",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "hover:bg-muted border-border bg-card"
                                            )}
                                        >
                                            <span className="font-semibold">{format(date, "EEEE")}</span>
                                            <span className={cn("text-sm", isSelected ? "text-primary-foreground/90" : "text-muted-foreground")}>
                                                {format(date, "do MMM")}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Time Slots */}
            <div className="md:col-span-7 lg:col-span-8">
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle>Time Slots</CardTitle>
                            <CardDescription>
                                Availability for {format(selectedDate, "EEEE, MMMM do, yyyy")}
                            </CardDescription>
                        </div>
                        <Button onClick={handleSave} disabled={saving || loading}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[500px] overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {AVAILABLE_TIME_SLOTS.map((slot) => {
                                        const isChecked = selectedSlots.includes(slot);
                                        return (
                                            <div
                                                key={slot}
                                                className={cn(
                                                    "flex items-center space-x-3 border rounded-md p-4 transition-colors cursor-pointer",
                                                    isChecked
                                                        ? "bg-primary/5 border-primary"
                                                        : "hover:bg-muted/50 border-border"
                                                )}
                                                onClick={() => handleSlotToggle(slot)}
                                            >
                                                <Checkbox
                                                    id={slot}
                                                    checked={isChecked}
                                                    onCheckedChange={() => handleSlotToggle(slot)}
                                                />
                                                <Label
                                                    htmlFor={slot}
                                                    className="cursor-pointer text-base font-medium flex-1 select-none"
                                                >
                                                    {slot}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
