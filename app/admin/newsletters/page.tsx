"use client";
import NewsletterTable from "@/components/admin/newsletter/NewsletterTable";

export default function NewslettersPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-red-600">Newsletters</h1>
        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="text-gray-600 hover:text-red-600"
            onClick={() => (window.location.href = "/admin")}
          >
            &larr; Back to Admin Dashboard
          </button>
          <a
            href="/admin/newsletters/create"
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Create Newsletter
          </a>
        </div>
      </div>

      <NewsletterTable />
    </div>
  );
}
