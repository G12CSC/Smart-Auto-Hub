"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function UserWelcome() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!session) return;
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 30_000);
    return () => clearTimeout(timeout);
  }, [session]);

  return (
    <>
      {session && visible ? (
        <div className="w-full border-b bg-card text-card-foreground">
          <div className="max-w-7xl mx-auto px-4 py-3 text-center text-sm">
            Welcome, <b>{session.user?.name || session.user?.email}</b> 👋
          </div>
        </div>
      ) : null}
    </>
  );
}
