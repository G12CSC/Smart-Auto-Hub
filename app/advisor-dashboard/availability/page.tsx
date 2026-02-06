"use client";

import { useState } from "react";
import { AdvisorHeader } from "@/components/AdvisorHeader";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Configuration for time slots
const TIME_SLOTS = [
    { id: "slot-1", label: "09:00 AM - 10:00 AM" },
    { id: "slot-2", label: "10:00 AM - 11:00 AM" },
    { id: "slot-3", label: "11:00 AM - 12:00 PM" },
    { id: "slot-4", label: "02:00 PM - 03:00 PM" },
    { id: "slot-5", label: "03:00 PM - 04:00 PM" },
    { id: "slot-6", label: "04:00 PM - 05:00 PM" },
];

export default function AvailabilityPage() {
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    // Toggle selection of a time slot
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
                title: "Date Required",
                description: "Please select a date from the calendar first.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);

        toast({
            title: "Availability Saved",
            description: `Updated ${selectedSlots.length} slots for ${date.toLocaleDateString()}.`,
        });
    };

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            <AdvisorHeader />

            <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Availability Manager
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your weekly schedule and time slots for customer consultations.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Time Slot Selection */}
                    <section className="lg:col-span-5 order-2 lg:order-1">
                        <Card className="border-l-4 border-l-primary shadow-sm h-full flex flex-col">
                            <CardHeader className="pb-4 border-b bg-card">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Select Time Slots
                                </CardTitle>
                                <CardDescription>
                                    {date
                                        ? `Set available hours for ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`
                                        : "Select a date to begin"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 pt-6 overflow-y-auto max-h-[600px]">
                                {date ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {TIME_SLOTS.map((slot) => {
                                            const isSelected = selectedSlots.includes(slot.id);
                                            return (
                                                <div
                                                    key={slot.id}
                                                    onClick={() => toggleSlot(slot.id)}
                                                    className={cn(
                                                        "group cursor-pointer flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ease-in-out",
                                                        isSelected
                                                            ? "border-primary bg-primary/5 shadow-sm"
                                                            : "border-transparent bg-secondary/50 hover:bg-secondary hover:border-muted-foreground/20"
                                                    )}
                                                >
                                                    <span className={cn("font-medium", isSelected ? "text-primary font-semibold" : "text-foreground")}>
                                                        {slot.label}
                                                    </span>
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                                        isSelected
                                                            ? "bg-primary border-primary text-primary-foreground"
                                                            : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
                                                    )}>
                                                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed mx-2">
                                        <CalendarIcon className="h-12 w-12 mb-3 opacity-20" />
                                        <p className="font-medium">No Date Selected</p>
                                        <p className="text-sm">Please select a date from the calendar <br /> to manage availability.</p>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="pt-4 pb-6 border-t bg-card mt-auto">
                                <Button
                                    className="w-full h-11 text-base shadow-md transition-all active:scale-[0.98]"
                                    size="lg"
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
                            </CardFooter>
                        </Card>
                    </section>

                    {/* RIGHT COLUMN: Enhanced Calendar */}
                    <section className="lg:col-span-7 order-1 lg:order-2">
                        <Card className="shadow-md overflow-hidden border-border/50">
                            <CardHeader className="bg-muted/30 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Calendar</CardTitle>
                                        <CardDescription>View and edit your monthly schedule.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                            <span>Selected</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-accent border border-primary/30" />
                                            <span>Today</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0 sm:p-6 flex justify-center bg-background min-h-[400px] items-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="p-4 rounded-md w-full max-w-full"
                                    classNames={{
                                        month: "space-y-4 w-full",
                                        caption: "flex justify-center pt-1 relative items-center mb-4 px-2",
                                        caption_label: "text-lg font-bold text-foreground tracking-tight",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: cn(
                                            "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity border border-input rounded-md hover:bg-accent hover:text-accent-foreground"
                                        ),
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex w-full justify-between mb-2",
                                        head_cell: "text-muted-foreground rounded-md w-full font-medium text-[0.8rem] uppercase tracking-wider text-center",
                                        row: "flex w-full mt-2 justify-between",
                                        cell: cn(
                                            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                                            "h-14 w-full sm:w-14" // Larger cell size
                                        ),
                                        day: cn(
                                            "h-14 w-full sm:w-14 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/50 rounded-md transition-all flex items-center justify-center"
                                        ),
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg scale-105 font-semibold",
                                        day_today: "bg-accent/50 text-accent-foreground font-bold border-2 border-primary/20",
                                        day_outside: "text-muted-foreground opacity-50",
                                        day_disabled: "text-muted-foreground opacity-50",
                                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                        day_hidden: "invisible",
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </section>

                </div>
            </main>
        </div>
    );
}
