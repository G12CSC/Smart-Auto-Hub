import CreateNewsletterForm from "@/components/admin/newsletter/CreateNewsletterForm";

export default function CreateNewsletterPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">
        Create Newsletter
      </h1>

      <CreateNewsletterForm />
    </div>
  );
}
