"use client";
import CreateNewsletterForm from "@/components/admin/newsletter/CreateNewsletterForm";

export default function CreateNewsletterPage() {
  return (
    <div className="p-8 max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto">
      <div>
        <CreateNewsletterForm />
      </div>
      <div className="p-5">
        <div>
          <div className="my-5">
            <a href="/admin/newsletters" className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" >
              ← Back to Newsletters
            </a>
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            Newsletter Creation Tips
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Compelling Title:</strong> Craft a title that grabs
              attention and reflects the content of your newsletter.
            </li>
            <li>
              <strong>Clear Subject Line:</strong> Ensure your subject line is
              concise and enticing to increase open rates.
            </li>
            <li>
              <strong>Engaging Content:</strong> Use a mix of text, images, and
              links to keep your readers interested.
            </li>
            <li>
              <strong>Call to Action:</strong> Include clear calls to action to
              guide your readers on what to do next.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
