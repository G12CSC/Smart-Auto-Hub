"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, search]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
        action: actionFilter,
        search,
      });

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      const data = await res.json();

      setLogs(data.logs);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="my-3 ">
        <a
          href="/admin"
          className="p-3 w-[200px] flex items-center gap-1 bg-red-600 rounded-md text-white"
        >
          <ArrowLeft /> Admin Dashboard
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="mb-4 p-4 bg-card  rounded-2xl h-[150px]  flex flex-col justify-center">
          <p className="font-medium text-2xl">Admin Audit Logs</p>
          <p className="text-sm mt-1">
            Monitor all admin activities for security and compliance.
          </p>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by action or entity..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />

        <select
          value={actionFilter}
          onChange={(e) => {
            setPage(1);
            setActionFilter(e.target.value);
          }}
          className="border px-3 py-2 rounded w-full md:w-1/4 bg-card dark:text-white"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATE_ADVISOR">Create Advisor</option>
          <option value="BOOKING_CREATED">Booking Created</option>
          <option value="DELETE_ADVISOR">Delete Advisor</option>
          <option value="UPDATE_ADVISOR">Update Advisor</option>
          <option value="CHANGE_PASSWORD">Change Password</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-2">Action</th>
              <th className="text-left px-4 py-2">User</th>
              <th className="text-left px-4 py-2">Entity</th>
              <th className="text-left px-4 py-2">Time</th>
              <th className="text-left px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{log.action}</td>
                  <td className="px-4 py-2">{log.userId || "-"}</td>
                  <td className="px-4 py-2">{log.entity}</td>
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <details>
                      <summary className="cursor-pointer text-blue-600">
                        View
                      </summary>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-2 mt-2 rounded text-xs overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
