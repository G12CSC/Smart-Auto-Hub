import { fetchJSON } from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAdvisor = () => {
  const [advisors, setAdvisors] = useState([]);

  const fetchAllAdvisors = async () => {
    try {
      const data = await fetchJSON("/api/admin/advisors");
      console.log("Fetched Advisors:", data);

      setAdvisors(data.advisors);
    } catch (error) {
      console.error("Failed to fetch advisors", error);
    }
  };

  const handleDeleteAdvisor = async (advisorId: string) => {
    if (!advisorId) {
      toast.error("Invalid advisor ID ❌");
      return;
    }

    try {
      const data = await fetchJSON(`/api/Advisors/${advisorId}`, {
        method: "DELETE",
      });

      if (data.success) {
        toast.success("Advisor deleted successfully ✅");
        await fetchAllAdvisors();
      } else {
        toast.error(data.message || "Failed to delete advisor ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete advisor ❌");
    }
  };

  useEffect(() => {
    fetchAllAdvisors();
  }, []);

  return {
    advisors,
    fetchAllAdvisors,
    handleDeleteAdvisor,
  };
};
