import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [
      user,
      enrollments,
      achievements,
      chatCount,
      quizResults,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          streak: true,
          xp: true,
          lastActive: true,
          createdAt: true,
        },
      }),
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: { id: true, title: true, image: true, category: true },
          },
        },
        orderBy: { enrolledAt: "desc" },
      }),
      prisma.achievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
      }),
      prisma.chatMessage.count({
        where: { userId, role: "user" },
      }),
      prisma.quizResult.findMany({
        where: { userId },
        include: {
          quiz: {
            select: {
              question: true,
              lesson: { select: { title: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const completedCourses = enrollments.filter((e) => e.completed).length;
    const inProgress = enrollments.filter(
      (e) => !e.completed && e.progress > 0
    ).length;
    const totalQuizScore = quizResults.reduce((sum, r) => sum + r.score, 0);
    const totalQuizTotal = quizResults.reduce((sum, r) => sum + r.total, 0);

    return NextResponse.json({
      user,
      enrollments,
      achievements,
      stats: {
        enrolledCourses: enrollments.length,
        completedCourses,
        inProgress,
        achievements: achievements.length,
        chatMessages: chatCount,
        quizzesTaken: quizResults.length,
        quizAccuracy: totalQuizTotal > 0
          ? Math.round((totalQuizScore / totalQuizTotal) * 100)
          : 0,
        streak: user?.streak ?? 0,
        xp: user?.xp ?? 0,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}
