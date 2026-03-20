"use client";

import { Loader2, Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm the Sameera Auto Advisor. How can I help you find your perfect vehicle today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/Chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input,
        }),
      });

      const data = await res.json();

      const botMessage = {
        role: "assistant",
        content: data.answer || "No response from AI.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "⚠️ AI server is currently unavailable.",
      };

      setMessages((prev) => [...prev, errorMessage]);
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <>
      {/* CHATBOT BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          {/* Outer spinning glow ring */}
          <div
            className="
            absolute inset-0 rounded-full
            bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500
            opacity-70 blur-md
            animate-spin-slow group-hover:animate-spin-fast
            glow-pulse
          "
          ></div>

          {/* Main Button */}
          <button
            className="
            relative p-4 rounded-full
            bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600
            text-white shadow-2xl
            transition-all duration-300
            hover:scale-110 active:scale-95
            cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {/* AI Icon */}
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m12.728 0l-2.121-2.121M8.757 8.757l-2.121-2.121" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>

            {/* Sparkles */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div
              className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-cyan-300 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-1 -left-1 w-2 h-2 bg-purple-200 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </button>

          {/* Tooltip */}
          <div
            className="
          absolute bottom-full right-0 mb-2
          px-3 py-1 bg-black/80 text-white text-sm rounded-lg 
          opacity-0 group-hover:opacity-100 transition-opacity
          whitespace-nowrap
        "
          >
            AI Assistant
          </div>
        </div>
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-card rounded-2xl shadow-2xl flex flex-col border border-cyan-400/20 backdrop-blur-sm animate-slide-in-up-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-500/10 via-blue-500/5 to-cyan-500/10" />
          {/* HEADER */}
          <div className="relative flex items-center justify-between px-6 py-4 border-b border-cyan-300/20 bg-gradient-to-r from-purple-500/15 via-blue-500/10 to-cyan-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m12.728 0l-2.121-2.121M8.757 8.757l-2.121-2.121" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>

              <div>
                <p className="font-semibold text-foreground text-sm">
                  Sameera Auto Advisor
                </p>
                <p className="text-xs text-muted-foreground">
                  Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="relative flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/70 via-background/60 to-background/80">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-500/30"
                      : "bg-muted/90 text-foreground rounded-bl-none shadow-sm border border-cyan-400/20"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* LOADING INDICATOR */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-muted px-4 py-3 rounded-2xl rounded-bl-none">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <form
            onSubmit={handleSend}
            className="relative border-t border-cyan-300/20 p-4 bg-gradient-to-t from-card via-card/95 to-card/70 space-y-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about vehicles, booking, or features..."
                className="flex-1 bg-input/90 border border-cyan-300/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />

              {/* SEND BUTTON */}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:brightness-110 disabled:opacity-60 text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md shadow-cyan-500/20"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Powered by AI • Available 24/7
            </p>
          </form>
        </div>
      )}
    </>
  );
}
