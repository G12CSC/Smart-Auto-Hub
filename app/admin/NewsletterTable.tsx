"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function NewsletterTable() {
  const [subscribers, setSubscribers] = useState([]);

  // Fetch subscribers
  useEffect(() => {
    fetch("/api/newsletter/listOfSubscriptions")
      .then((res) => res.json())
      .then((data) => setSubscribers(data));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-semibold text-sm">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-sm">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-sm">
              Source
            </th>
            <th className="px-4 py-3 text-left font-semibold text-sm">
              Status
            </th>
            <th className="px-4 py-3 text-left font-semibold text-sm">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {subscribers.map((s) => (
            <tr
              key={s.id}
              className="border-b border-border hover:bg-secondary/30 transition"
            >
              <td className="px-4 py-4">{s.email}</td>
              <td className="px-4 py-4 text-sm text-muted-foreground">
                {new Date(s.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-4">
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-700">
                  {s.source}
                </span>
              </td>

              <td className="px-4 py-4">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-700 text-xs font-medium">
                  {s.status}
                </span>
              </td>

              <td className="px-4 py-4">
                <Button size="sm" variant="ghost">
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NewsletterTable;
