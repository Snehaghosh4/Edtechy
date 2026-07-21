"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Trophy,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/chat", label: "AI Tutor", icon: MessageSquare },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

const PUBLIC_NAV_ITEMS = [
  { href: "/", label: "Home", icon: GraduationCap },
  { href: "/courses", label: "Courses", icon: BookOpen },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAuthenticated = status === "authenticated";
  const isLanding = pathname === "/";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || !isLanding
            ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold text-lg transition-transform duration-200 group-hover:scale-105">
                E
              </div>
              <span className="text-xl font-bold tracking-tight">
                Edtechy
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {(isAuthenticated ? NAV_ITEMS : PUBLIC_NAV_ITEMS).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 transition-all",
                        isActive && "font-medium"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* Notifications bell */}
                  <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* User dropdown on desktop */}
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 rounded-full pl-1.5 pr-3"
                      onClick={() => signOut()}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={session.user?.image ?? ""} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {session.user?.name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-[100px] truncate">
                        {session.user?.name ?? "User"}
                      </span>
                      <LogOut className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </Button>
                  </div>

                  {/* Mobile menu toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-full"
                    onClick={() => setMobileOpen(!mobileOpen)}
                  >
                    {mobileOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              ) : !isLanding ? (
                <div className="flex items-center gap-2">
                  <Link href="/">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="sm" className="gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              ) : null}

              {isLanding && !isAuthenticated && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="sm" className="gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background animate-slide-up">
            <div className="space-y-1 px-4 py-4">
              {(isAuthenticated ? NAV_ITEMS : PUBLIC_NAV_ITEMS).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-3 px-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image ?? ""} />
                        <AvatarFallback className="text-xs">
                          {session?.user?.name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session?.user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session?.user?.email ?? ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <Toaster position="top-center" richColors />
    </>
  );
}
