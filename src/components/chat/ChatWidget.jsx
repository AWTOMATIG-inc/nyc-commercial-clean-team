"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

const OPENING_MESSAGE = {
  role: "bot",
  content:
    "Hi! I can answer questions about our services or help you request a free quote. How can I help?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([OPENING_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.reply) {
        throw new Error(data.error || "Chat request failed");
      }

      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Sorry, something went wrong — please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-999 w-[calc(100vw-2.5rem)] max-w-90 h-[70vh] max-h-125 bg-white rounded-2xl shadow-custom flex flex-col overflow-hidden border border-light-blue/30">
          <div className="bg-slate text-white px-4 py-3 flex items-center justify-between shrink-0">
            <span className="font-jetbrains font-medium text-sm sm:text-base">
              Chat with NYC Clean Team
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
            >
              <Icon icon="mdi:close" width={20} height={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-skyblue-light">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  message.role === "user"
                    ? "self-end bg-red text-white rounded-br-sm"
                    : "self-start bg-white text-dark-slate border border-light-blue/30 rounded-bl-sm"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-white text-dark-slate border border-light-blue/30 rounded-2xl rounded-bl-sm max-w-[85%] px-4 py-2 text-sm leading-relaxed">
                ...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 p-3 border-t border-light-blue/30 bg-white shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 text-sm px-3 py-2 rounded-full border border-light-blue/50 focus:outline-none focus:border-slate disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              aria-label="Send message"
              disabled={isLoading}
              className="size-9 shrink-0 flex items-center justify-center rounded-full bg-red text-white hover:bg-slate transition disabled:opacity-60"
            >
              <Icon icon="mdi:send" width={18} height={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="size-12 flex justify-center items-center fixed bottom-5 right-5 text-xl bg-red text-white rounded-full shadow-lg hover:bg-slate transition z-999"
      >
        <Icon
          icon={isOpen ? "mdi:close" : "mdi:message-text"}
          width={24}
          height={24}
        />
      </button>
    </>
  );
}
