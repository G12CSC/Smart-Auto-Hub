"use client";
import { useState } from "react";

export default function SendButton({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
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
      disabled={disabled}
      className={`px-3 py-1 rounded text-white ${
        disabled ? "bg-gray-400" : "bg-green-600"
      }`}
    >
      {disabled ? "Sent" : "Send"}
    </button>
  );
}
