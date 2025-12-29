"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNewsletterForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });

    router.push("/admin/newsletters");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="Newsletter title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border p-2 rounded min-h-[200px]"
        placeholder="Newsletter message (HTML supported)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />

      <button
        type="submit"
        className="px-6 py-2 bg-black text-white rounded"
      >
        Save Newsletter
      </button>
    </form>
  );
}
