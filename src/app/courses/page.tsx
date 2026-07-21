"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Clock,
  Signal,
  Users,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  level: string;
  duration: string | null;
  instructor: string | null;
  lessonCount: number;
  enrollment: { progress: number; completed: boolean } | null;
}

const CATEGORIES = [
  "All",
  "Programming",
  "AI & ML",
  "Cybersecurity",
  "Data Science",
  "Cloud",
  "DevOps",
];

const LEVELS = ["All", "beginner", "intermediate", "advanced"];

function CoursesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState(searchParams.get("category") || "All");
  const [level, setLevel] = React.useState("All");

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  React.useEffect(() => {
    setLoading(true);
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All" ||
      course.category.toLowerCase() === category.toLowerCase();
    const matchesLevel = level === "All" || course.level === level;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categoryCounts = courses.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
        <p className="text-muted-foreground mt-1">
          Discover courses across programming, AI, cybersecurity, and more
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className="shrink-0"
            >
              {cat}
              {cat !== "All" && categoryCounts[cat] && (
                <Badge variant="secondary" className="ml-1.5 text-xs">
                  {categoryCounts[cat]}
                </Badge>
              )}
            </Button>
          ))}
          <div className="hidden sm:flex gap-2">
            {CATEGORIES.slice(4).map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className="shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 mb-8">
        {LEVELS.map((l) => (
          <Button
            key={l}
            variant={level === l ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLevel(l)}
            className="capitalize"
          >
            {l}
          </Button>
        ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setLevel("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, i) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card
                className="group h-full hover:shadow-lg transition-all duration-200 animate-slide-up cursor-pointer overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary">{course.category}</Badge>
                    {course.enrollment && (
                      <Badge
                        variant={course.enrollment.completed ? "success" : "warning"}
                      >
                        {course.enrollment.completed ? "Completed" : "In Progress"}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Signal className="h-3.5 w-3.5" />
                      <span className="capitalize">{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{course.lessonCount} lessons</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>

                  {course.instructor && (
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.instructor}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {course.enrollment ? "Continue Learning" : "View Course"}
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CoursesContent />
    </React.Suspense>
  );
}
