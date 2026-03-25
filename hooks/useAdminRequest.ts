import { fetchJSON } from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAdminRequest = () => {
  const [newsletterSubscribers, setNewsletterSubscribers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  const handleAdminRequest = async () => {
    try {
      const data = await fetchJSON("/api/newsletter/listOfSubscriptions");
      setNewsletterSubscribers(data.length);
    } catch (error) {
      console.error("Newsletter fetch failed:", error);
    }

    try {
      const data = await fetchJSON("/api/vehicles/getVehicles");
      setTotalVehicles(data);
    } catch (error) {
      console.error("Vehicles fetch failed:", error);
    }

    try {
      const data = await fetchJSON("/api/Consultations/getAllBooking");

      const pending = Array.isArray(data)
        ? data.filter((req: any) => req.status === "PENDING").length
        : (data.data || []).filter((req: any) => req.status === "PENDING")
            .length;

      setPendingRequests(pending);
    } catch (error) {
      console.error("Bookings fetch failed:", error);
    }
  };

  useEffect(() => {
    handleAdminRequest();
  }, []);

  return {
    newsletterSubscribers,
    totalVehicles,
    pendingRequests,
  };
};
