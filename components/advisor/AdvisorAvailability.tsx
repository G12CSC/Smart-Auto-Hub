"use client";

import { useState, useEffect } from "react";
import { getAdvisorAvailability, saveAdvisorAvailability } from "@/app/advisor-dashboard/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AdvisorAvailabilityProps {
    advisorId: string;
}

export function AdvisorAvailability({ advisorId }: AdvisorAvailabilityProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (date) {
            const fetchAvailability = async () => {
                setLoading(true);
                const res = await getAdvisorAvailability(advisorId, date);
                if (res.success) {
                    setSelectedSlots(res.data || []);
                }
                setLoading(false);
            };
            fetchAvailability();
        }
    }, [advisorId, date]);

    const handleSlotToggle = (slot: string) => {
        setSelectedSlots((prev) =>
            prev.includes(slot)
                ? prev.filter((s) => s !== slot)
                : [...prev, slot]
        );
    };

    const handleSave = async () => {
        if (!date) return;
        setSaving(true);
        const res = await saveAdvisorAvailability(advisorId, date, selectedSlots);
        setSaving(false);

        if (res.success) {
            toast.success("Availability saved successfully");
        } else {
            toast.error("Failed to save availability");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-slideInUp">
            <div className="md:col-span-5 lg:col-span-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Select Date</CardTitle>
                        <CardDescription>Choose a day to manage availability</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow-sm"
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-7 lg:col-span-8">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle>Time Slots</CardTitle>
                            <CardDescription>
                                {date ? `Set availability for ${format(date, "PPP")}` : "Select a date first"}
                            </CardDescription>
                        </div>
                        {date && (
                            <Button onClick={handleSave} disabled={saving || loading}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {date ? (
                            loading ? (
                                <div className="flex h-64 items-center justify-center text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {TIME_SLOTS.map((slot) => (
                                        <div
                                            key={slot}
                                            className={`
                                        flex items-center space-x-2 border rounded-md p-3 transition-colors cursor-pointer
                                        ${selectedSlots.includes(slot)
                                                    ? "bg-primary/10 border-primary"
                                                    : "hover:bg-accent hover:text-accent-foreground border-border"
                                                }
                                    `}
                                            onClick={() => handleSlotToggle(slot)}
                                        >
                                            <Checkbox
                                                id={slot}
                                                checked={selectedSlots.includes(slot)}
                                                onCheckedChange={() => handleSlotToggle(slot)}
                                            />
                                            <Label
                                                htmlFor={slot}
                                                className="cursor-pointer text-sm font-medium flex-1"
                                            >
                                                {slot}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex h-64 items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground">
                                Select a date to view and edit time slots
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
