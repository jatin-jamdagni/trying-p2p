"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface ChatProps {
  roomId: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export default function Chat({ roomId }: ChatProps) {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://echo.websocket.org"); // Use a proper WebSocket server for production

    ws.onmessage = (event) => {
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: "Other",
        content: event.data,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.send(`${roomId}: ${message}`);
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Chat: Room {roomId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="h-[300px] mb-4 p-4 rounded-md border"
          ref={scrollAreaRef}
        >
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === "You" ? "bg-blue-100 ml-auto" : "bg-gray-100"
              } max-w-[80%] break-words`}
            >
              <p className="font-semibold">{msg.sender}</p>
              <p>{msg.content}</p>
              <p className="text-xs text-gray-500">{msg.timestamp}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-grow"
          />
          <Button onClick={sendMessage} disabled={!message.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
