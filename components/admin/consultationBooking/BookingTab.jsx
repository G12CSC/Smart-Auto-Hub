import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, RefreshCcw, Binoculars, UserCog } from "lucide-react";
import { sendAdminMessagesForBookings } from "@/app/APITriggers/sendAdminMessagesForBookings.js";

export default function BookingTab({
    recentRequests,
    fetchBookings,
    setSelectedRequestForAdvisor,
    setIsAdvisorModalOpen,
}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
                {/* Title + Refresh */}
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">Consultation Bookings</h2>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefreshBookings}
                        disabled={isRefreshing}
                        title="Refresh bookings"
                    >
                        <RefreshCcw
                            size={18}
                            className={isRefreshing ? "animate-spin" : ""}
                        />
                    </Button>
                </div>

                {/* Search + Filter */}
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

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left font-semibold text-sm">
                                Customer
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-sm">
                                Contact Details
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-sm">
                                Booking Type
                            </th>
                            {/* <th className="px-4 py-3 text-left font-semibold text-sm">
                                Vehicle Details
                              </th> */}
                            <th className="px-4 py-3 text-left font-semibold text-sm">
                                Date
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-sm">
                                Time
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-sm">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-sm">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {recentRequests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.fullName}</td>
                                <td>{request.email}</td>
                                <td>{request.consultationType}</td>
                                {/* <td>{request.vehicleType}</td> */}
                                <td>{request.preferredDate.split("T")[0]}</td>
                                <td>{request.preferredTime}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === "ACCEPTED"
                                            ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                                            : request.status === "REJECTED"
                                                ? "bg-rose-500/20 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300"
                                                : request.status === "CANCELLED"
                                                    ? "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300"
                                                    : request.status === "COMPLETED"
                                                        ? "bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300"
                                                        : "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
                                            }`}
                                    >
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    {(request.status === "PENDING" || request.status === "REJECTED") && (
                                        <>

                                            <Button
                                                size="sm"
                                                className="text-xs bg-primary hover:bg-primary/90"
                                                onClick={() => {
                                                    setSelectedRequestForAdvisor(request);
                                                    setIsAdvisorModalOpen(true);
                                                }}
                                            >
                                                <Binoculars size={14} />
                                                Send to an Advisor
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 text-white text-xs hover:bg-blue-900"
                                        onClick={() =>
                                            sendAdminMessagesForBookings(request.id)
                                        }
                                    >
                                        <UserCog size={14} />
                                        Send Message
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}