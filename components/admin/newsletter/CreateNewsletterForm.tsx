"use client";
import { useState } from "react";

export default function CreateNewsletterForm() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subject, content }),
    });

    setTitle("");
    setSubject("");
    setContent("");
    alert("Newsletter created");

    window.location.href = "/admin/newsletters";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow border space-y-6"
    >
      <h1 className="text-2xl font-semibold text-gray-800">
        Create Newsletter
      </h1>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          placeholder="Newsletter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>

      {/* HTML Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          HTML Content
        </label>
        <textarea
          placeholder="Paste your email HTML here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="reset"
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700
           hover:bg-gray-100 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium
          hover:bg-red-700 transition cursor-pointer"
        >
          Create Newsletter
        </button>
      </div>
    </form>
  );
}
