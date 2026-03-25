import { fetchJSON } from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBranchInventory } from "./useBranchInventory";

export const useTransaction = () => {
  const { form, setForm } = useBranchInventory();
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const handleTransactionSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setLoadingTransactions(true);

    try {
      const data = await fetchJSON("/api/admin/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (data.success) {
        setForm({
          id: "",
          buyerName: "",
          buyerEmail: "",
          phone: "",
          location: "",
          price: "",
          brand: "",
          model: "",
          year: "",
        });

        toast.success("Transaction saved successfully");
      }
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      toast.error(error.message || "Failed to save transaction");
    } finally {
      setLoadingTransactions(false);
    }
  };

  return {
    handleTransactionSubmit,
    loadingTransactions,
  };
};
