"use client";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const ViewButton = ({ id, disabled }: { id: string; disabled?: boolean }) => {
  const router = useRouter();
  const handleView = () => {
    router.push(`/admin/newsletters/view/${id}`);
  };
  return (
    <button
      onClick={handleView}
      disabled={disabled}
      className={`bg-green-600 hover:bg-green-700 p-2 rounded-lg text-white cursor-pointer ${
        disabled ? "bg-gray-400" : "bg-green-600"
      }`}
    >
      <Eye />
    </button>
  );
};

export default ViewButton;
