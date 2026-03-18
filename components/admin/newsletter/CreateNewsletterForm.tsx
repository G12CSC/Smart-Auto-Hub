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
      className="max-w-3xl mx-auto bg-gray-100 dark:bg-[#0b0b0b] text-gray-900 dark:text-white md:p-8 transition-colors duration-300 p-8 rounded-xl shadow border space-y-6"
    >
      <h1 className="text-2xl font-semibold text-gray-800">
        Create Newsletter
      </h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
          Title
        </label>

        <input
          type="text"
          placeholder="Newsletter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border
           bg-gray-50 border-gray-300 text-gray-900
           focus:outline-none focus:ring-2 focus:ring-blue-500
           dark:bg-[#1a1a1a] dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Subject */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          placeholder="Newsletter subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border
           bg-gray-50 border-gray-300 text-gray-900
           focus:outline-none focus:ring-2 focus:ring-blue-500
           dark:bg-[#1a1a1a] dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* HTML Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          HTML Content
        </label>
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Paste your email HTML here..."
          className="w-full px-4 py-2 rounded-lg border
         bg-gray-50 border-gray-300 text-gray-900
         focus:outline-none focus:ring-2 focus:ring-blue-500
         dark:bg-[#1a1a1a] dark:border-gray-700 dark:text-white"
        ></textarea>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          type="reset"
          className="px-5 py-2 rounded-lg border
                 border-gray-300 text-gray-700 hover:bg-gray-100
                 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg font-medium
                 bg-red-600 text-white hover:bg-red-700"
        >
          Create Newsletter
        </button>
      </div>
    </form>
  );
}
