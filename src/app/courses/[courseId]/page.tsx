"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Clock,
  Signal,
  Users,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Quiz {
  id: string;
  question: string;
  options: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  quizzes: Quiz[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  level: string;
  duration: string | null;
  instructor: string | null;
  lessons: Lesson[];
  enrollment: { progress: number; completed: boolean; enrolledAt: string } | null;
}

export default function CourseDetail() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = React.useState<CourseData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [enrolling, setEnrolling] = React.useState(false);
  const [currentLesson, setCurrentLesson] = React.useState<Lesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = React.useState<Record<string, boolean | null>>({});
  const [submittingQuiz, setSubmittingQuiz] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  React.useEffect(() => {
    const courseId = params.courseId as string;
    setLoading(true);
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        if (data.lessons?.length > 0) {
          setCurrentLesson(data.lessons[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.courseId]);

  const handleEnroll = async () => {
    if (!session) return;
    setEnrolling(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: params.courseId }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to enroll");
        setEnrolling(false);
        return;
      }

      toast.success("Enrolled successfully!");
      // Refresh course data
      const courseRes = await fetch(`/api/courses/${params.courseId}`);
      const courseData = await courseRes.json();
      setCourse(courseData);
      setEnrolling(false);
    } catch {
      toast.error("Failed to enroll");
      setEnrolling(false);
    }
  };

  const handleAnswerQuiz = async (quizId: string, answer: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: answer }));
    setSubmittingQuiz(quizId);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answer }),
      });

      const data = await res.json();
      setQuizResults((prev) => ({ ...prev, [quizId]: data.correct }));

      if (data.correct) {
        toast.success("Correct! +10 XP 🎉");
      } else {
        toast.error("Not quite. Try again!");
      }
    } catch {
      toast.error("Failed to submit answer");
    }

    setSubmittingQuiz(null);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Link href="/courses">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const lessonCount = course.lessons.length;
  const progress = course.enrollment?.progress ?? 0;
  const isEnrolled = !!course.enrollment;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
      {/* Breadcrumb */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course header */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <Badge variant="secondary" className="text-sm">
                {course.category}
              </Badge>
              <Badge variant="outline" className="capitalize text-sm">
                {course.level}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {lessonCount} lessons
              </div>
              {course.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
              )}
              {course.instructor && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.instructor}
                </div>
              )}
              {!isEnrolled && session && (
                <Button onClick={handleEnroll} disabled={enrolling} className="ml-auto">
                  {enrolling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enroll Now
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Lesson content */}
          {currentLesson && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Lesson {currentLesson.order}: {currentLesson.title}
                </h2>
              </div>

              <Card>
                <CardContent className="p-6 prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {currentLesson.content}
                  </div>
                </CardContent>
              </Card>

              {/* Quizzes */}
              {currentLesson.quizzes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Knowledge Check
                  </h3>

                  {currentLesson.quizzes.map((quiz) => {
                    const options = JSON.parse(quiz.options) as string[];
                    const selected = selectedAnswers[quiz.id];
                    const result = quizResults[quiz.id];

                    return (
                      <Card
                        key={quiz.id}
                        className={cn(
                          "transition-colors duration-200",
                          result === true && "border-emerald-500/50 bg-emerald-500/5",
                          result === false && "border-rose-500/50 bg-rose-500/5"
                        )}
                      >
                        <CardContent className="p-5">
                          <p className="font-medium mb-3">{quiz.question}</p>
                          <div className="space-y-2">
                            {options.map((option, idx) => {
                              const isSelected = selected === idx;
                              const isCorrect = result === true && isSelected;
                              const isWrong = result === false && isSelected;

                              return (
                                <button
                                  key={idx}
                                  disabled={submittingQuiz === quiz.id || result !== undefined}
                                  onClick={() => handleAnswerQuiz(quiz.id, idx)}
                                  className={cn(
                                    "w-full text-left p-3 rounded-lg border text-sm transition-all duration-200",
                                    "hover:bg-muted/50 hover:border-primary/30",
                                    "disabled:cursor-not-allowed",
                                    isSelected && "border-primary",
                                    isCorrect && "border-emerald-500 bg-emerald-500/10",
                                    isWrong && "border-rose-500 bg-rose-500/10"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={cn(
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                                        isSelected && "border-primary bg-primary text-primary-foreground",
                                        isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                                        isWrong && "border-rose-500 bg-rose-500 text-white"
                                      )}
                                    >
                                      {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span>{option}</span>
                                    {isCorrect && (
                                      <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Lesson navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  disabled={currentLesson.order <= 1}
                  onClick={() => {
                    const prev = course.lessons.find(
                      (l) => l.order === currentLesson.order - 1
                    );
                    if (prev) setCurrentLesson(prev);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Lesson {currentLesson.order} of {lessonCount}
                </span>
                <Button
                  variant="outline"
                  disabled={currentLesson.order >= lessonCount}
                  onClick={() => {
                    const next = course.lessons.find(
                      (l) => l.order === currentLesson.order + 1
                    );
                    if (next) setCurrentLesson(next);
                  }}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Lesson list */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
              <CardDescription>
                {lessonCount} lessons
                {isEnrolled && ` • ${Math.round(progress)}% complete`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {isEnrolled && (
                <Progress value={progress} className="mb-4 h-2" />
              )}
              {course.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLesson(lesson)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-colors",
                    "hover:bg-muted/50",
                    currentLesson?.id === lesson.id && "bg-muted font-medium"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      currentLesson?.id === lesson.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/10"
                    )}
                  >
                    {lesson.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{lesson.title}</span>
                  </div>
                  {lesson.quizzes.length > 0 && (
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
