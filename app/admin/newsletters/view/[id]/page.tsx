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
    }).then((res) => res.json())
    .then((data) => {
        console.log(data);
        setNewsletter(data);
    });
    toast.success("Newsletter updated successfully");
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">View Newsletter</h1>
      <form className="space-y-4" onSubmit={handleUpdateNewsletter}>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-medium">Title</h2>
            <input
              type="text"
              className="p-3 w-full rounded-md border border-gray-400"
              value={newsletter.title}
              onChange={(e) =>  {
                setNewsletter({...newsletter, title: e.target.value})
              }}
              readOnly={!edit}
            />
          </div>
          <div>
            <h2 className="text-lg font-medium">Subject</h2>
            <input
              type="text"
              className="p-3 w-full rounded-md border border-gray-400"
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
                setNewsletter({...newsletter, content: e.target.value})
              }}
              className="border p-4 w-full h-64 resize-none overflow-scroll"
            >
              {newsletter.content}
            </textarea>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="mt-6 px-6 py-2 cursor-pointer bg-gray-400 text-white rounded"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          <button
            type="button"
            className={`mt-6 px-6 py-2 cursor-pointer bg-red-600 text-white rounded ${edit ? "hover:cursor-not-allowed" : ""}`} disabled={edit}
            onClick={() => {
              setEdit(!edit);
            }}
          >
            Edit
          </button>
          <button
            type="submit"
            className={
              "mt-6 px-6 py-2 cursor-pointer bg-green-600 text-white rounded " +
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
  );
}
