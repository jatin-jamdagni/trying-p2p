"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { text: string; sender: "user" | "server" }[]
  >([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://echo.websocket.org");

    ws.onmessage = (event) => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: event.data, sender: "server" },
      ]);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.send(message);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: message, sender: "user" },
      ]);
      setMessage("");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="h-[400px] mb-4 p-4 rounded-md border"
          ref={scrollAreaRef}
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              } max-w-[80%] ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
