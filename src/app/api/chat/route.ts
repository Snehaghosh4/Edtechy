import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
});

const SYSTEM_PROMPT = `You are an AI tutor for Edtechy, an AI-powered educational platform. You help students learn programming, AI, cybersecurity, data science, and other tech subjects.

Your responsibilities:
- Answer questions clearly and patiently
- Explain complex concepts in simple terms
- Provide code examples when relevant
- Generate practice questions and quizzes
- Summarize learning content
- Encourage and motivate students

Keep responses educational, supportive, and focused on learning.`;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "user",
        content: message,
      },
    });

    // Get recent messages for context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const chatHistory = recentMessages.reverse().map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // If no OpenAI key, return a mock response
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "sk-dummy"
    ) {
      const mockResponse =
        "I'm your AI tutor! I can help you learn programming, AI, and more. To enable AI-powered responses, add your OpenAI API key in the settings or environment variables. For now, I can still help with general questions!";

      await prisma.chatMessage.create({
        data: {
          userId: session.user.id,
          role: "assistant",
          content: mockResponse,
        },
      });

      return NextResponse.json({
        response: mockResponse,
        disclaimer: true,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatHistory,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ??
      "I'm sorry, I couldn't generate a response.";

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: aiResponse,
      },
    });

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastActive: today },
    });

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
