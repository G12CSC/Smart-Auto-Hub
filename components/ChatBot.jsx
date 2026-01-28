"use client";

import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // ⏳ Simulated API delay (5 seconds)
    setTimeout(() => {
      const botMessage = {
        role: "assistant",
        content:
          "This is a dummy response 🤖. Later this will be replaced with FastAPI data.",
      };

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 5000);
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
        <div className="fixed bottom-20 right-6 z-50 w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col border">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2 font-semibold text-black">
              <FaRobot />
              Smart Auto Hub AI Assistant
            </div>
            <button
              onClick={() => setOpen(false)}
              className="bg-black text-white p-2 rounded-full hover:opacity-90 transition"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* LOADING (animated for 5s) */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-2xl text-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSend}
            className="border-t p-3 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask something..."
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black text-black"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* SEND BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white p-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
