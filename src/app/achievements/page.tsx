"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Lock,
  Sparkles,
  Target,
  Loader2,
  ChevronRight,
  Flame,
  Star,
  Medal,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDateRelative } from "@/lib/utils";

interface AchievementItem {
  type: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface AchievementsData {
  achievements: AchievementItem[];
  stats: {
    totalUnlocked: number;
    totalAvailable: number;
    recentUnlocked: AchievementItem[];
  };
}

export default function Achievements() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = React.useState<AchievementsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  React.useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/achievements")
        .then((res) => res.json())
        .then(setData)
        .catch(() => setLoading(false))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { achievements, stats } = data;
  const progressPercent = Math.round(
    (stats.totalUnlocked / stats.totalAvailable) * 100
  );

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Earn badges by completing courses, maintaining streaks, and learning
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8 bg-gradient-to-r from-amber-500/5 via-amber-500/5 to-orange-500/5 border-amber-500/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
                <Trophy className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-3xl font-bold">
                  {stats.totalUnlocked}
                  <span className="text-lg text-muted-foreground">
                    /{stats.totalAvailable}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent unlocks */}
      {stats.recentUnlocked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Recently Unlocked</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stats.recentUnlocked.map((a) => (
              <Card key={a.type} className="shrink-0 border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateRelative(a.unlockedAt!)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All achievements */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card
            key={achievement.type}
            className={cn(
              "transition-all duration-200",
              achievement.unlocked
                ? "hover:shadow-md"
                : "opacity-60 hover:opacity-80"
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl",
                    achievement.unlocked
                      ? "bg-amber-500/10"
                      : "bg-muted"
                  )}
                >
                  {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{achievement.title}</p>
                    {achievement.unlocked && (
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {achievement.unlocked
                      ? achievement.description
                      : achievement.requirement}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Unlocked {formatDateRelative(achievement.unlockedAt)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <Trophy className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
          <p className="text-muted-foreground mb-6">
            Start learning to unlock your first achievement
          </p>
          <Link href="/courses">
            <Button>
              Browse Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
