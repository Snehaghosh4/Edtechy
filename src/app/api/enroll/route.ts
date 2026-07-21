import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already enrolled" },
        { status: 409 }
      );
    }

    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    });

    // Create achievement for first enrollment
    const enrollmentCount = await prisma.enrollment.count({
      where: { userId: session.user.id },
    });

    if (enrollmentCount === 1) {
      await prisma.achievement.create({
        data: {
          userId: session.user.id,
          type: "first_course",
          title: "First Steps",
          description: "Enrolled in your first course",
          icon: "🎯",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json(
      { error: "Failed to enroll" },
      { status: 500 }
    );
  }
}
