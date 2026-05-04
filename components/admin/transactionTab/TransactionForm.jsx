
import InputBox from "@/components/Input";
import { useBranchInventory } from "@/hooks/useBranchInventory";
import { useEffect, useState } from "react";
import { fetchJSON } from "@/services/api";
import { toast } from "sonner";


export default function TransactionForm() {
    const { form, setForm, brands, setBrands, models, setModels, years, setYears, handleChange, handleBrandChange, handleModelChange } = useBranchInventory();
    const [loadingModels, setLoadingModels] = useState(false);
    const [loadingYears, setLoadingYears] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchJSON("/api/cars/brands");
            setBrands(data);
        };
        loadData();
    }, []);

    const handleTransactionSubmit = async (e) => {
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
        } catch (error) {
            console.error("Error saving transaction:", error);
            toast.error(error.message || "Failed to save transaction");
        } finally {
            setLoadingTransactions(false);
        }
    };

    // 🔹 Load models when brand changes
    useEffect(() => {
        if (!form.brand) return;

        const loadModels = async () => {
            setLoadingModels(true);
            try {
                const data = await fetchJSON(`/api/cars/models?brand=${form.brand}`);
                setModels(data);
            } catch (error) {
                console.error("Failed to load models", error);
            } finally {
                setLoadingModels(false);
            }
        };
        loadModels();
    }, [form.brand]);

    useEffect(() => {
        if (!form.brand || !form.model) return;

        const loadYears = async () => {
            setLoadingYears(true);

            try {
                const data = await fetchJSON(`/api/cars/years?brand=${form.brand}&model=${form.model}`);
                setYears(data);
            } catch (error) {
                console.error("Failed to load years", error);
            } finally {
                setLoadingYears(false);
            }
        };
        loadYears();
    }, [form.model]);

    return (
        <>
            <form
                onSubmit={handleTransactionSubmit}
                className="max-w-3xl mx-auto p-6 bg-white dark:bg-black/50 shadow rounded-2xl space-y-6"
            >
                <h2 className="text-xl font-bold">Transaction Form</h2>

                {/* 🔹 Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <InputBox name="id" placeholder="Transaction ID" onChange={handleChange} value={form.id} />
                    <InputBox name="buyerName" placeholder="Buyer Name" onChange={handleChange} value={form.buyerName} />

                    <InputBox name="buyerEmail" placeholder="Email" onChange={handleChange} value={form.buyerEmail} />
                    <InputBox name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} />

                    <InputBox name="location" placeholder="Location" onChange={handleChange} value={form.location} />
                    <InputBox name="price" placeholder="Price" onChange={handleChange} value={form.price} />
                </div>

                {/* 🔹 Car Selection */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Brand */}
                    <select
                        value={form.brand}
                        onChange={handleBrandChange}
                        className="input disabled:bg-gray-100 p-2 bg-gray-200 text-black dark:bg-black/80 dark:text-white"
                        required
                    >
                        <option value="">Select Brand</option>
                        {brands.map(b => (
                            <option key={b}>{b}</option>
                        ))}
                    </select>

                    {/* Model */}
                    <select
                        value={form.model}
                        onChange={handleModelChange}
                        disabled={!form.brand || loadingModels}
                        className="input disabled:bg-gray-100 p-2 bg-gray-200 text-black dark:bg-black/80 dark:text-white"
                        required
                    >
                        <option value="">
                            {loadingModels ? "Loading..." : "Select Model"}
                        </option>
                        {models.map(m => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>

                    {/* Year */}
                    <select
                        value={form.year}
                        onChange={handleChange}
                        name="year"
                        required
                        disabled={!form.model || loadingYears}
                        className="input disabled:bg-gray-100 p-2 bg-gray-200 text-black dark:bg-black/80 dark:text-white"
                    >
                        <option value="">
                            {loadingYears ? "Loading..." : "Select Year"}
                        </option>
                        {years.map(y => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg ${loadingTransactions ? "cursor-not-allowed" : ""}`}
                >
                    {loadingTransactions ? "Submitting..." : "Submit Transaction"}
                </button>
            </form>
        </>
    );
}