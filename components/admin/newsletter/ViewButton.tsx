"use client";
import { Eye } from "lucide-react";
const ViewButton = ({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) => {

    const handleView = () => {
        window.location.href = `/admin/newsletters/view/${id}`;
    }
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
  )
}

export default ViewButton;
