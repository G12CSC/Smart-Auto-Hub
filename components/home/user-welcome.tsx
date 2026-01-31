"use client";

import { useSession } from "next-auth/react";

export default function UserWelcome() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div className="text-center py-4 bg-green-100 text-green-700">
          Welcome, <b>{session.user?.name || session.user?.email}</b> 👋
        </div>
      ) : null}
    </>
  );
}
