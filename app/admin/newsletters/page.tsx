import NewsletterTable from "@/components/admin/newsletter/NewsletterTable";

export default function NewslettersPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Newsletters</h1>

        <a
          href="/admin/newsletters/create"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Create Newsletter
        </a>
      </div>

      <NewsletterTable />
    </div>
  );
}
