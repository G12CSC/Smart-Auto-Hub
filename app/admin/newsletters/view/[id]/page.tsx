"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { toast } from "sonner";

export default function ViewNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [newsletter, setNewsletter] = useState<any>({
    title: "",
    subject: "",
    content: "",
  });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchNewsletter = async () => {
      await fetch(`/api/newsletter/view/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setNewsletter(data);
        });
    };

    fetchNewsletter();
  }, [id]);

  const handleUpdateNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/newsletter/view/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newsletter.title,
        subject: newsletter.subject,
        content: newsletter.content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNewsletter(data);
      });
    toast.success("Newsletter updated successfully");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">View Newsletter</h2>

          <form className="space-y-4" onSubmit={handleUpdateNewsletter}>
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-medium">Title</h2>
                <input
                  type="text"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                  value={newsletter.title}
                  onChange={(e) => {
                    setNewsletter({ ...newsletter, title: e.target.value });
                  }}
                  readOnly={!edit}
                />
              </div>
              <div>
                <h2 className="text-lg font-medium">Subject</h2>
                <input
                  type="text"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                  value={newsletter.subject}
                  onChange={(e) =>
                    setNewsletter({ ...newsletter, subject: e.target.value })
                  }
                  readOnly={!edit}
                />
              </div>
              <div>
                <h2 className="text-lg font-medium">Content</h2>
                <textarea
                  readOnly={!edit}
                  value={newsletter.content}
                  onChange={(e) => {
                    setNewsletter({ ...newsletter, content: e.target.value });
                  }}
                  className="border p-4 w-full h-64 overflow-scroll bg-zinc-800 resize-none border-zinc-700 rounded-lg"
                >
                  {newsletter.content}
                </textarea>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 rounded-lg"
                onClick={() => window.history.back()}
              >
                Back
              </button>
              <button
                type="button"
                className={`px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg ${edit ? "hover:cursor-not-allowed" : ""}`}
                disabled={edit}
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                Edit
              </button>
              <button
                type="submit"
                className={
                  "px-6 py-2 cursor-pointer bg-green-600 text-white rounded " +
                  (edit ? "" : "hidden")
                }
                onClick={() => {
                  setEdit(false);
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
