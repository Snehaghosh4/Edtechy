import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const courses = await prisma.course.findMany({
      where: { published: true },
      include: {
        lessons: {
          select: { id: true },
        },
        enrollments: userId
          ? {
              where: { userId },
              select: { progress: true, completed: true },
            }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = courses.map((course) => ({
      ...course,
      lessonCount: course.lessons.length,
      lessons: undefined,
      enrollment: course.enrollments?.[0] ?? null,
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
