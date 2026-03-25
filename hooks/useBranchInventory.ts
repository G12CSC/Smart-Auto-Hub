import { fetchJSON } from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useBranchInventory = () => {
  const [branchInventory, setBranchInventory] = useState({});
  const [form, setForm] = useState({
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

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const handleBranchInventory = async () => {
    // This function can be expanded to fetch and display inventory for each branch
    const branchInventory = await fetchJSON("/api/branches");
    console.log("Branch Inventory:", branchInventory);
    setBranchInventory(branchInventory);
  };

  useEffect(() => {
    handleBranchInventory();
  }, []);
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      brand: e.target.value,
      model: "",
      year: "",
    });
    setModels([]);
    setYears([]);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      model: e.target.value,
      year: "",
    });
    setYears([]);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return {
    handleBrandChange,
    handleModelChange,
    handleChange,
    branchInventory, setBranchInventory,
    form, setForm,
    brands, setBrands,
    models, setModels,
    years, setYears
  };
};
