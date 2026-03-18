"use client";
import { useEffect, useState } from "react";
import SendButton from "./SendButton";
import ViewButton from "./ViewButton";
import DeleteButton from "./DeleteButton";

export default function NewsletterTable() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/newsletter")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="dark:bg-[#0f0f0f] text-gray-800 dark:text-white rounded-xl overflow-hidden border dark:border-gray-800">
      <table className="w-full">
        <thead className="dark:bg-[#1a1a1a] text-black dark:text-gray-300 text-sm uppercase">
          <tr>
            <th className="px-6 py-4 text-center">Title</th>
            <th className="px-6 py-4 text-center">Created</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Sent At</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.map((n) => (
            <tr
              className="hover:bg-gray-200 dark:hover:bg-[#1a1a1a] transition"
              key={n.id}
            >
              <td className="px-6 py-4">
                <span className="inline-flex items-center text-center dark:text-white">
                  {n?.title}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                <span className="inline-flex items-center text-center">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                  {n.broadcasts?.[0]?.status ?? "NOT SENT"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                {n?.sentAt ? new Date(n.sentAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 justify-center">
                  <SendButton id={n.id} />
                  <ViewButton id={n.id} />
                  <DeleteButton id={n.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
