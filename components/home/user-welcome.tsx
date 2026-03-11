"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function UserWelcome() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const userEmail = session?.user?.email;
    if (!userEmail) return;
    if (typeof window === "undefined") return;

    const storageKey = `userWelcomeShown:${userEmail}`;
    const alreadyShown = sessionStorage.getItem(storageKey);
    if (alreadyShown === "true") {
      return;
    }

    setVisible(true);
    sessionStorage.setItem(storageKey, "true");

    const timeout = setTimeout(() => setVisible(false), 30_000);
    return () => clearTimeout(timeout);
  }, [session?.user?.email]);

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
