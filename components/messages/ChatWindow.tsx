"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useMessages, type MessageRow } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  matchId: string;
  currentUserId: string;
  initialMessages: MessageRow[];
}

export function ChatWindow({ matchId, currentUserId, initialMessages }: ChatWindowProps) {
  const { messages, sendMessage, isLoading } = useMessages(matchId, initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={cn("flex", isOwn ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {!isOwn && (
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {msg.sender.email}
                  </p>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    isOwn ? "text-primary-foreground/60 text-right" : "text-muted-foreground"
                  )}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t pt-4">
        <div className="flex gap-2 items-end">
          <textarea
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] max-h-32"
            placeholder="Type a message... (Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
