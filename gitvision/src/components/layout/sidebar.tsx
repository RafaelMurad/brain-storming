"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Map,
  GitCommit,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface SidebarProps {
  session: Session | null;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Canvas", href: "/canvas", icon: Map },
  { name: "Commits", href: "/commits", icon: GitCommit },
  { name: "Docs", href: "/docs", icon: FileText },
];

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen bg-card border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b">
        {sidebarOpen ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <FolderGit2 className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">GitVision</span>
          </Link>
        ) : (
          <Link href="/dashboard">
            <FolderGit2 className="h-8 w-8 text-primary" />
          </Link>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      {session?.user && (
        <div className="border-t p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              !sidebarOpen && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-muted-foreground"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
