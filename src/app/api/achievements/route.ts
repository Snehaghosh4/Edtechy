import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const achievements = await prisma.achievement.findMany({
      where: { userId: session.user.id },
      orderBy: { unlockedAt: "desc" },
    });

    // Define all possible achievements
    const allAchievements = [
      {
        type: "first_course",
        title: "First Steps",
        description: "Enrolled in your first course",
        icon: "🎯",
        requirement: "Enroll in any course",
      },
      {
        type: "quiz_perfect",
        title: "Perfect Score",
        description: "Got 100% on a quiz",
        icon: "💯",
        requirement: "Answer all questions correctly in a quiz",
      },
      {
        type: "streak_3",
        title: "Getting Started",
        description: "Maintained a 3-day streak",
        icon: "🔥",
        requirement: "Visit for 3 days in a row",
      },
      {
        type: "streak_7",
        title: "Week Warrior",
        description: "Maintained a 7-day streak",
        icon: "⭐",
        requirement: "Visit for 7 days in a row",
      },
      {
        type: "streak_30",
        title: "Monthly Master",
        description: "Maintained a 30-day streak",
        icon: "👑",
        requirement: "Visit for 30 days in a row",
      },
      {
        type: "course_complete",
        title: "Course Graduate",
        description: "Completed your first course",
        icon: "🎓",
        requirement: "Complete all lessons in a course",
      },
      {
        type: "chat_10",
        title: "Curious Mind",
        description: "Sent 10 messages to the AI tutor",
        icon: "💡",
        requirement: "Send 10 chat messages",
      },
      {
        type: "xp_500",
        title: "Knowledge Seeker",
        description: "Earned 500 XP",
        icon: "📚",
        requirement: "Accumulate 500 XP",
      },
      {
        type: "xp_1000",
        title: "Dedicated Learner",
        description: "Earned 1000 XP",
        icon: "🏅",
        requirement: "Accumulate 1000 XP",
      },
      {
        type: "five_courses",
        title: "Course Collector",
        description: "Enrolled in 5 courses",
        icon: "📋",
        requirement: "Enroll in 5 courses",
      },
    ];

    const unlocked = achievements.map((a) => a.type);
    const enriched = allAchievements.map((a) => ({
      ...a,
      unlocked: unlocked.includes(a.type),
      unlockedAt: achievements.find((ua) => ua.type === a.type)?.unlockedAt ?? null,
    }));

    // Stats
    const totalUnlocked = achievements.length;
    const totalAvailable = allAchievements.length;
    const recentUnlocked = achievements.slice(0, 3);

    return NextResponse.json({
      achievements: enriched,
      stats: {
        totalUnlocked,
        totalAvailable,
        recentUnlocked,
      },
    });
  } catch (error) {
    console.error("Achievements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
