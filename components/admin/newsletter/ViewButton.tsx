
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
        className={`px-5 py-1 rounded text-white cursor-pointer ${
            disabled ? "bg-gray-400" : "bg-green-600"
        }`}
    >
        View
    </button>
  )
}

export default ViewButton;
