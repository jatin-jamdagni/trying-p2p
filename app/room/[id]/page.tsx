"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoChat from "@/components/VideoChat";
import Chat from "@/components/Chat";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Room() {
  const params = useParams();
  const id = params?.id;

  if (!id) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Invalid room ID</p>
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Room: {id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <VideoChat roomId={id as string} />
            </div>
            <div>
              <Chat roomId={id as string} />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
