"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Trophy,
  MessageSquare,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDateRelative } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsData {
  notifications: Notification[];
  unreadCount: number;
}

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  info: Info,
  success: Sparkles,
  warning: AlertTriangle,
  achievement: Trophy,
  course: BookOpen,
  chat: MessageSquare,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  info: "text-blue-500 bg-blue-500/10",
  success: "text-emerald-500 bg-emerald-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  achievement: "text-amber-500 bg-amber-500/10",
  course: "text-purple-500 bg-purple-500/10",
  chat: "text-cyan-500 bg-cyan-500/10",
};

export default function Notifications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = React.useState<NotificationsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const fetchNotifications = React.useCallback(() => {
    if (status === "authenticated") {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then(setData)
        .catch(() => setLoading(false))
        .finally(() => setLoading(false));
    }
  }, [status]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "all" }),
    });
    fetchNotifications();
  };

  const getIcon = (type: string) => {
    const Icon = NOTIFICATION_ICONS[type] ?? Info;
    return Icon;
  };

  const getColor = (type: string) => {
    return NOTIFICATION_COLORS[type] ?? "text-blue-500 bg-blue-500/10";
  };

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-72 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { notifications, unreadCount } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "No unread notifications"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You&apos;ll see notifications here when you enroll in courses,
              earn achievements, or receive updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const color = getColor(notification.type);

            return (
              <Card
                key={notification.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-sm cursor-pointer",
                  !notification.read && "border-primary/20 bg-primary/[0.02]"
                )}
                onClick={() => {
                  if (!notification.read) markAsRead(notification.id);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDateRelative(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
