"use client";
import { useEffect, useState } from "react";
import SendButton from "./SendButton";
import ViewButton from "./ViewButton";

export default function NewsletterTable() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/newsletter")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <table className="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="py-5 bg-gray-100 text-gray-700">
          <th>Created</th>
          <th>Status</th>
          <th>Sent At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((n) => (
          <tr className="border-t hover:bg-gray-50 transition" key={n.id}>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              <span className="inline-flex items-center text-center">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </td>
            <td className="px-6 py-4 flex items-center justify-center text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {n.broadcasts?.[0]?.status ?? "NOT SENT"}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {n.broadcasts?.[0]?.sentAt
                ? new Date(n.broadcasts[0].sentAt).toLocaleDateString()
                : "-"}
            </td>
            <td className="px-6 py-4 text-right space-x-5 flex justify-center">
              <SendButton id={n.id} />
              <ViewButton id={n.newsletterId}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
