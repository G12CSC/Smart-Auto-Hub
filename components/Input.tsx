
export default function InputBox({ name, placeholder, onChange }: any) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className="input"
    />
  );
}