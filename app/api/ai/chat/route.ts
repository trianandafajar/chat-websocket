import { streamAiResponse } from "@/lib/ai";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

type ChatMessage = {
  role?: string;
  content?: string;
};

export async function POST(req: NextRequest) {
  const auth = await getServerSession(authOptions);
  if (!auth?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : [];

  if (messages.length === 0) {
    return new Response("messages required", { status: 400 });
  }

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          await streamAiResponse(messages, {
            onChunk: (chunk: string) => controller.enqueue(encoder.encode(chunk)),
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("AI chat error", error);
    return new Response("AI service unavailable", { status: 502 });
  }
}
