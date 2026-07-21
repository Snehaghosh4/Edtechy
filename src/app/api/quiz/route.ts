import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, answer } = await request.json();

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const isCorrect = quiz.correctAnswer === answer;
    const score = isCorrect ? 1 : 0;

    // Save result
    await prisma.quizResult.upsert({
      where: {
        userId_quizId: {
          userId: session.user.id,
          quizId,
        },
      },
      update: { score, total: 1 },
      create: {
        userId: session.user.id,
        quizId,
        score,
        total: 1,
      },
    });

    // Update XP
    if (isCorrect) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { xp: { increment: 10 } },
      });

      // Check for perfect score achievement
      const allResults = await prisma.quizResult.findMany({
        where: { userId: session.user.id },
      });

      const perfectQuizzes = allResults.filter(
        (r) => r.score === r.total
      ).length;

      if (perfectQuizzes >= 1) {
        const existing = await prisma.achievement.findFirst({
          where: {
            userId: session.user.id,
            type: "quiz_perfect",
          },
        });
        if (!existing) {
          await prisma.achievement.create({
            data: {
              userId: session.user.id,
              type: "quiz_perfect",
              title: "Perfect Score",
              description: "Got 100% on a quiz",
              icon: "💯",
            },
          });
        }
      }
    }

    return NextResponse.json({
      correct: isCorrect,
      correctAnswer: quiz.correctAnswer,
      score,
    });
  } catch (error) {
    console.error("Quiz error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
