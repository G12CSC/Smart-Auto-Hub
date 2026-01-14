import { Trash } from "lucide-react";
const DeleteButton = ({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) => {

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this newsletter?")) return;

        fetch(`/api/newsletter/${id}`, {
            method: "DELETE",
        }).then((res) => {
            if (!res.ok) {
                alert("Failed to delete newsletter");
                return;
            }
            window.location.reload();
        });
    }
  return (
    <button 
        onClick={handleDelete}
        disabled={disabled}
        className={`px-5 py-1 rounded text-white cursor-pointer ${
            disabled ? "bg-gray-400" : "bg-red-600"
        }`}
    >
        <Trash />
    </button>
  )
}

export default DeleteButton;
