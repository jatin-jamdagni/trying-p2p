"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");

  const createRoom = () => {
    const newRoomId = uuidv4();
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            P2P Video Call and Real-Time Chat
          </CardTitle>
          <CardDescription className="text-center">
            Create a new room or join an existing one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={createRoom}>
            <Video className="mr-2 h-4 w-4" /> Create Room
          </Button>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <Button onClick={joinRoom}>
              <Users className="mr-2 h-4 w-4" /> Join
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-center text-gray-500">
          Enter a room ID to join an existing room, or create a new one.
        </CardFooter>
      </Card>
    </main>
  );
}
