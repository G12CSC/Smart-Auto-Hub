"use client";
import { useState } from "react";
import { Check, Send } from "lucide-react";

export default function SendButton({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    setIsSending(true);

    if (!confirm("Send this newsletter to all subscribers?")) return;

    const res = await fetch(`/api/newsletter/${id}/send`, {
      method: "POST",
    });

    if (!res.ok) {
      alert("Failed to send newsletter");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={handleSend}
      disabled={isSending || disabled}
      className={`px-5 py-1 rounded text-white cursor-pointer ${
        disabled ? "bg-gray-400" : "bg-yellow-600"
      }`}
    >
      {!disabled ? <Send /> : <Check />}
    </button>
  );
}
