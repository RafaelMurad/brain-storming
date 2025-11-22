"use client";

import { useForgeStore } from "@/lib/store";
import { cn, calculateLevel, xpProgress, xpForNextLevel } from "@/lib/utils";
import { Flame, Trophy, Github, LogIn, Menu } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, setView, view } = useForgeStore();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">🔨</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">
                Frontend<span className="text-primary">Forge</span>
              </h1>
              <p className="text-xs text-muted-foreground">Learn by Building</p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: "home", label: "Home" },
              { id: "explore", label: "Explore" },
              { id: "paths", label: "Learning Paths" },
              { id: "generate", label: "AI Generate" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as typeof view)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  view === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Streak */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-full">
                  <Flame className="w-4 h-4 text-orange-500 flame" />
                  <span className="text-sm font-medium text-orange-500">
                    {user.streak} day streak
                  </span>
                </div>

                {/* Level & XP */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Level {calculateLevel(user.xp)}</p>
                    <p className="text-sm font-medium">{user.xp} XP</p>
                  </div>
                  <div className="level-badge">Lv.{calculateLevel(user.xp)}</div>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2">
                  <img
                    src={user.image || "/avatar.png"}
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-full border-2 border-primary"
                  />
                </div>
              </>
            ) : (
              <button className="btn btn-github">
                <Github className="w-4 h-4" />
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>

        {/* XP Progress bar (when authenticated) */}
        {isAuthenticated && user && (
          <div className="mt-4 max-w-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Level {calculateLevel(user.xp)}</span>
              <span>{xpForNextLevel(calculateLevel(user.xp)) - user.xp} XP to next level</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${xpProgress(user.xp)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
