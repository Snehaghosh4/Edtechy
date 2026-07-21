"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Trophy,
  MessageSquare,
  Flame,
  Zap,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate, formatDateRelative, calculateLevel, xpForNextLevel } from "@/lib/utils";

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    streak: number;
    xp: number;
    lastActive: string;
    createdAt: string;
  } | null;
  enrollments: Array<{
    course: { id: string; title: string; image: string | null; category: string };
    progress: number;
    completed: boolean;
    enrolledAt: string;
  }>;
  achievements: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    icon: string | null;
    unlockedAt: string;
  }>;
  stats: {
    enrolledCourses: number;
    completedCourses: number;
    inProgress: number;
    achievements: number;
    chatMessages: number;
    quizzesTaken: number;
    quizAccuracy: number;
    streak: number;
    xp: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  React.useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((res) => res.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const level = calculateLevel(data.user?.xp ?? data.stats.xp);
  const currentXp = data.user?.xp ?? data.stats.xp;
  const nextLevelXp = xpForNextLevel(level);
  const xpProgress = Math.min((currentXp / nextLevelXp) * 100, 100);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    sub,
    color,
    bg,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
    color: string;
    bg: string;
  }) => (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            )}
          </div>
          <div className={cn("p-2.5 rounded-xl", bg)}>
            <Icon className={cn("h-5 w-5", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {data.user?.name ?? "Learner"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your learning progress overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/courses">
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Level & XP */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 border-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-3xl font-bold">{level}</p>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  XP: {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()}
                </span>
                <span className="text-sm font-medium">{Math.round(xpProgress)}%</span>
              </div>
              <Progress value={xpProgress} className="h-2.5" />
              <p className="text-xs text-muted-foreground mt-2">
                {nextLevelXp - currentXp} XP until Level {level + 1}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-lg">
                {data.stats.streak}
              </span>
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={BookOpen}
          label="Enrolled"
          value={data.stats.enrolledCourses}
          sub={data.stats.completedCourses > 0 ? `${data.stats.completedCourses} completed` : undefined}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <StatCard
          icon={Target}
          label="In Progress"
          value={data.stats.inProgress}
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
        <StatCard
          icon={Trophy}
          label="Achievements"
          value={data.stats.achievements}
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
        <StatCard
          icon={BarChart3}
          label="Quiz Accuracy"
          value={`${data.stats.quizAccuracy}%`}
          sub={`${data.stats.quizzesTaken} quizzes taken`}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          icon={MessageSquare}
          label="AI Chat Messages"
          value={data.stats.chatMessages}
          color="text-cyan-500"
          bg="bg-cyan-500/10"
        />
        <StatCard
          icon={Zap}
          label="XP Earned"
          value={data.stats.xp.toLocaleString()}
          color="text-orange-500"
          bg="bg-orange-500/10"
        />
        <StatCard
          icon={Sparkles}
          label="Member Since"
          value={formatDate(data.user?.createdAt ?? new Date())}
          color="text-rose-500"
          bg="bg-rose-500/10"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              My Courses
            </CardTitle>
            <CardDescription>
              {data.enrollments.length > 0
                ? `${data.enrollments.length} course${data.enrollments.length !== 1 ? "s" : ""} enrolled`
                : "Enroll in your first course to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.enrollments.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground mb-4">No courses yet</p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </div>
            ) : (
              data.enrollments.slice(0, 5).map((enrollment) => (
                <Link
                  key={enrollment.course.id}
                  href={`/courses/${enrollment.course.id}`}
                  className="block group"
                >
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate group-hover:text-primary transition-colors">
                        {enrollment.course.title}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {enrollment.course.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {Math.round(enrollment.progress)}%
                      </div>
                      <Progress value={enrollment.progress} className="mt-1 h-1.5 w-20" />
                    </div>
                  </div>
                </Link>
              ))
            )}
            {data.enrollments.length > 5 && (
              <Link href="/courses">
                <Button variant="ghost" className="w-full gap-2">
                  View All Courses
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              {data.achievements.length > 0
                ? `${data.achievements.length} total achievement${data.achievements.length !== 1 ? "s" : ""}`
                : "Complete tasks to earn achievements"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.achievements.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground mb-4">No achievements yet</p>
                <Link href="/achievements">
                  <Button variant="outline">View Achievements</Button>
                </Link>
              </div>
            ) : (
              data.achievements.slice(0, 5).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-lg">
                    {achievement.icon ?? "🏆"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDateRelative(achievement.unlockedAt)}
                  </span>
                </div>
              ))
            )}
            {data.achievements.length > 5 && (
              <Link href="/achievements">
                <Button variant="ghost" className="w-full gap-2">
                  View All Achievements
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
