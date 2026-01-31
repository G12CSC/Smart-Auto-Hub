"use client";

import { Loader2, Newspaper } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { handleSubscribe } from "@/app/APITriggers/handleSubscribe";

export default function NewsletterForm() {
  const [email, setEmail] = useState<string>("");
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const onSubscribeWrapper = async () => {
    if (!email) return handleSubscribe(email, session?.user?.id, setEmail); // Let the helper handle empty email validation

    setIsLoading(true);

    try {
      await handleSubscribe(email, session?.user?.id, setEmail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            //handleSubscribe(email, session?.user?.id, setEmail);
            onSubscribeWrapper();
          }
        }}
        disabled={isLoading}
        className="flex-1 px-6 py-4 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-4 focus:ring-white/30 backdrop-blur-sm"
      />
      <Button
        type="button"
        variant="secondary"
        // onClick={() =>
        //   handleSubscribe(email, session?.user?.id, setEmail)
        // }
        onClick={() => onSubscribeWrapper()}
        disabled={isLoading}
        className="h-15 font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={20} />
            Subscribing
          </>
        ) : (
          <>
            <Newspaper className="mr-2" size={20} />
            Subscribe
          </>
        )}
      </Button>
    </div>
  );
}
