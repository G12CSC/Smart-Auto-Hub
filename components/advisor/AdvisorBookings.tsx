"use client";

import { useState, useEffect } from "react";
import { getAdvisorBookings, BookingFilter } from "@/app/advisor-dashboard/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Mail, MessageCircle, Phone, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AdvisorBookingsProps {
    advisorId: string;
}

export function AdvisorBookings({ advisorId }: AdvisorBookingsProps) {
    const [filter, setFilter] = useState<BookingFilter>("all");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            const res = await getAdvisorBookings(advisorId, filter, date);
            if (res.success && res.data) {
                setBookings(res.data);
            }
            setLoading(false);
        };

        fetchBookings();
    }, [advisorId, filter, date]);

    const filteredBookings = bookings.filter((booking) =>
        (booking.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (booking.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-slideInUp">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Your Bookings</h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {(["all", "today", "pending", "confirmed"] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        onClick={() => {
                            setFilter(f);
                            if (f === 'today' || f === 'all') setDate(undefined);
                        }}
                        className="capitalize whitespace-nowrap"
                    >
                        {f}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading bookings...</div>
            ) : filteredBookings.length > 0 ? (
                <div className="space-y-4">
                    {filteredBookings.map((booking, index) => (
                        <div
                            key={booking.id}
                            className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 animate-slideInLeft"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2 md:mb-0">
                                        <p className="font-semibold text-lg">{booking.fullName}</p>
                                    </div>

                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p className="flex items-center gap-2">
                                            <Mail size={14} /> {booking.email}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Phone size={14} /> {booking.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm">
                                        <span className="font-medium text-foreground">Type:</span> {booking.consultationType}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-foreground">Vehicle:</span> {booking.vehicleType}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium text-foreground">Date:</span> {format(new Date(booking.preferredDate), "PPP")} at {booking.preferredTime}
                                    </p>
                                </div>
                            </div>

                            {booking.message && (
                                <div className="bg-secondary/30 p-3 rounded-md text-sm text-muted-foreground mb-4 italic">
                                    "{booking.message}"
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 mt-2">
                                <span
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
                                        booking.status === "ACCEPTED" // Schema uses ACCEPTED, UI says Confirmed
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                    )}
                                >
                                    <Clock size={12} />
                                    {booking.status === "ACCEPTED" ? "Confirmed" : booking.status}
                                </span>

                                <Button size="sm" variant="outline">
                                    <MessageCircle size={14} className="mr-2" />
                                    Contact Customer
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">No bookings found for the selected criteria.</p>
                    {filter !== 'all' && (
                        <Button variant="link" onClick={() => { setFilter('all'); setDate(undefined); }}>View All Bookings</Button>
                    )}
                </div>
            )}
        </div>
    );
}
