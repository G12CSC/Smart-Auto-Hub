"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    RefreshCcw,
    Binoculars,
    UserCog,
} from "lucide-react";
import { toast } from "sonner";
import AdvisorSelectionModal from "@/components/advisor-selection-modal";
import { sendAdminMessagesForBookings } from "@/app/APITriggers/sendAdminMessagesForBookings.js";
import { assignBookingToAdvisor } from "@/app/advisor-dashboard/actions";

export default function ConsultationsPage() {
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
    const [selectedRequestForAdvisor, setSelectedRequestForAdvisor] = useState<any>(null);

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/Consultations/getAllBooking");
            const data = await res.json();
            setRecentRequests(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleRefreshBookings = async () => {
        try {
            setIsRefreshing(true);
            await fetchBookings();
        } catch (error) {
            console.error("Failed to refresh bookings", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">Consultation Bookings</h2>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefreshBookings}
                        disabled={isRefreshing}
                        title="Refresh bookings"
                    >
                        <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
                    </Button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />
                        <Input
                            placeholder="Search requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-4 py-3 text-left font-semibold text-sm">Customer</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Contact Details</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Booking Type</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Vehicle Details</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Time</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.map((request) => (
                                <tr key={request.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium">{request.fullName}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{request.email}</td>
                                    <td className="px-4 py-3 text-sm">{request.consultationType}</td>
                                    <td className="px-4 py-3 text-sm">{request.vehicleType}</td>
                                    <td className="px-4 py-3 text-sm">{request.preferredDate?.split("T")[0]}</td>
                                    <td className="px-4 py-3 text-sm">{request.preferredTime}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === "ACCEPTED"
                                                ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                                                : request.status === "REJECTED"
                                                    ? "bg-rose-500/20 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300"
                                                    : request.status === "CANCELLED"
                                                        ? "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300"
                                                        : "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
                                                }`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="text-xs h-8 px-2"
                                            onClick={() => {
                                                toast.success("Issue reported to customer", {
                                                    description: "We sent an email apology regarding unavailable advisors."
                                                });
                                            }}
                                        >
                                            Report Issue
                                        </Button>

                                        {(request.status === "PENDING" || request.status === "REJECTED") && (
                                            <Button
                                                size="sm"
                                                className="text-xs h-8 px-2 bg-primary hover:bg-primary/90"
                                                onClick={() => {
                                                    setSelectedRequestForAdvisor(request);
                                                    setIsAdvisorModalOpen(true);
                                                }}
                                            >
                                                <Binoculars size={14} className="mr-1" />
                                                Assign
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            className="bg-blue-600 text-white text-xs h-8 px-2 hover:bg-blue-700"
                                            onClick={() => sendAdminMessagesForBookings(request.id)}
                                        >
                                            <UserCog size={14} className="mr-1" />
                                            Message
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdvisorSelectionModal
                open={isAdvisorModalOpen}
                onClose={() => setIsAdvisorModalOpen(false)}
                bookingId={selectedRequestForAdvisor?.id}
                date={selectedRequestForAdvisor?.preferredDate}
                bookingSlot={selectedRequestForAdvisor?.preferredTime}
                onConfirm={async (advisor: any) => {
                    if (!selectedRequestForAdvisor || !advisor?.id) return;
                    const res = await assignBookingToAdvisor(selectedRequestForAdvisor.id, advisor.id);
                    if (res.success) {
                        toast.success("Advisor assigned successfully");
                        setIsAdvisorModalOpen(false);
                        fetchBookings();
                    } else {
                        toast.error(res.error || "Failed to assign advisor");
                    }
                }}
            />
        </div>
    );
}
