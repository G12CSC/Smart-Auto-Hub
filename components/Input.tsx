
export default function InputBox({ name, placeholder, onChange, value }: any) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className="input p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      required
    />
  );
}