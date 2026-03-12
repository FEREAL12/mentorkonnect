"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface ChatMsg {
  id: string;
  message: string;
  senderName: string;
  fromAdmin: boolean;
  createdAt: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("chat_session_id");
  if (!sid) {
    sid = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("chat_session_id", sid);
  }
  return sid;
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const sessionId = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSeenCount = useRef(0);

  useEffect(() => {
    sessionId.current = getSessionId();
    const saved = localStorage.getItem("chat_visitor_name");
    if (saved) { setName(saved); setNameSet(true); }
  }, []);

  const fetchMessages = async () => {
    if (!sessionId.current) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId.current}`);
      if (!res.ok) return;
      const data: ChatMsg[] = await res.json();
      setMessages(data);
      // Count new admin replies while chat is closed
      if (!open) {
        const adminMsgs = data.filter((m) => m.fromAdmin).length;
        if (adminMsgs > lastSeenCount.current) {
          setUnread(adminMsgs - lastSeenCount.current);
        }
      }
    } catch {
      // ignore
    }
  };

  // Poll every 5s
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Clear unread when opening
  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    lastSeenCount.current = messages.filter((m) => m.fromAdmin).length;
  };

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("chat_visitor_name", name.trim());
    setNameSet(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message: text,
          senderName: name || "Visitor",
        }),
      });
      await fetchMessages();
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all active:scale-95"
        aria-label="Open chat"
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden flex flex-col"
          style={{ height: "420px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 bg-blue-600 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">MentorKonnect Support</p>
              <p className="text-xs text-blue-100">We typically reply within a few hours</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Name prompt */}
          {!nameSet ? (
            <form onSubmit={handleSetName} className="flex flex-col gap-3 p-5 flex-1 justify-center">
              <p className="text-sm font-medium text-gray-700 text-center">
                Welcome! What should we call you?
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-sm font-semibold text-white transition-colors"
              >
                Start Chat
              </button>
            </form>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center text-xs text-gray-400 pt-8">
                    Send a message to start the conversation
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.fromAdmin ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                        msg.fromAdmin
                          ? "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                          : "bg-blue-600 text-white rounded-br-sm"
                      }`}
                    >
                      {msg.fromAdmin && (
                        <p className="text-[10px] font-semibold text-blue-600 mb-0.5">Support</p>
                      )}
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-200 px-3 py-2 bg-white">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
