"use client";

import { useEffect, useState } from "react";
import SendButton from "./SendButton";
import { NewsletterBroadcast } from "@/types/index";

export default function NewsletterTable() {
  const [data, setData] = useState<NewsletterBroadcast[]>([]);

  useEffect(() => {
    fetch("/api/newsletter")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <table className="w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3">Status</th>
          <th className="p-3">Created</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map(item => (
          <tr key={item.id} className="border-t">
            <td className="p-3">{item.title}</td>
            <td className="p-3 text-center">
              {item.sentAt ? "Sent" : "Draft"}
            </td>
            <td className="p-3 text-center">
              {new Date(item.createdAt).toLocaleDateString()}
            </td>
            <td className="p-3 text-center">
              <SendButton
                id={item.id}
                disabled={!!item.sentAt}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
