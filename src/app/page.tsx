"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  Trophy,
  Shield,
  Brain,
  Rocket,
  ArrowRight,
  BarChart3,
  Globe,
  MessageCircle,
  ChevronRight,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Curated Courses",
    description: "Learn programming, AI, cybersecurity, and data science with structured paths",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: MessageSquare,
    title: "AI Tutor",
    description: "Get instant help, explanations, and personalized quizzes from your AI tutor",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Earn badges, maintain streaks, and track your XP as you learn",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your learning stats, quiz scores, and course completion",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Structured Learning",
    description: "Follow well-organized lessons with quizzes and hands-on practice",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Brain,
    title: "Smart Recommendations",
    description: "Get course suggestions based on your interests and learning goals",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const COURSE_CATEGORIES = [
  { name: "Programming", count: 8, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { name: "AI & ML", count: 6, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { name: "Cybersecurity", count: 5, color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  { name: "Data Science", count: 7, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { name: "Cloud", count: 4, color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { name: "DevOps", count: 3, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const mode = e.currentTarget.dataset.mode;

    if (mode === "register") {
      const name = (formData.get("name") as string) || email.split("@")[0];
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            {status === "authenticated" ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-Powered Learning Platform
            </Badge>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
              Master Tech Skills with{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-in">
              Learn programming, AI, cybersecurity, and data science with interactive courses,
              personalized AI tutoring, and a community-driven approach.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in">
              <Link href="#get-started">
                <Button size="xl" className="gap-2 w-full sm:w-auto">
                  Get Started Free
                  <Rocket className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="xl" variant="outline" className="gap-2 w-full sm:w-auto">
                  Browse Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 animate-slide-up">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>1,000+ learners</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>30+ courses</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>4.8/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to learn
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From structured courses to AI-powered tutoring, Edtechy provides all the tools
              to accelerate your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                        feature.bgColor
                      )}
                    >
                      <Icon className={cn("h-6 w-6", feature.color)} />
                    </div>
                    <CardTitle className="mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explore by category
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Choose from a wide range of tech fields
              </p>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="gap-2">
                View All Courses
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COURSE_CATEGORIES.map((cat) => (
              <Link key={cat.name} href={`/courses?category=${cat.name.toLowerCase()}`}>
                <Card className="group cursor-pointer hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 text-center">
                    <Badge className={cn("mb-2", cat.color)}>
                      {cat.count} courses
                    </Badge>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {cat.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Auth / CTA Section */}
      <section id="get-started" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Start your learning journey today
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of learners mastering tech skills with AI-powered guidance.
                Sign up for free and start learning.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Access 30+ expert-crafted courses",
                  "Get personalized AI tutoring",
                  "Track progress with streaks and XP",
                  "Earn achievements and certificates",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="shadow-xl animate-slide-up">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Create an account or sign in to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="mt-4">
                    <form data-mode="signin" onSubmit={handleAuth} className="space-y-4">
                      {error && (
                        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="mt-4">
                    <form data-mode="register" onSubmit={handleAuth} className="space-y-4">
                      {error && (
                        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          name="name"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              E
            </div>
            <span className="font-semibold">Edtechy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-Powered Learning Platform
          </p>
          <div className="flex items-center gap-4">              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Globe className="h-4 w-4" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
