"use client";

import { useState } from "react";
import { Flame, Plus, Check, Trophy, Calendar, Target, Zap, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  completedDates: string[];
  target: number;
  frequency: "daily" | "weekly";
}

const sampleHabits: Habit[] = [
  { id: "1", name: "Morning Meditation", icon: "🧘", color: "#8b5cf6", streak: 14, completedDates: ["2024-03-20", "2024-03-19", "2024-03-18"], target: 1, frequency: "daily" },
  { id: "2", name: "Exercise", icon: "💪", color: "#22c55e", streak: 7, completedDates: ["2024-03-20", "2024-03-19"], target: 1, frequency: "daily" },
  { id: "3", name: "Read 30 minutes", icon: "📚", color: "#3b82f6", streak: 21, completedDates: ["2024-03-20"], target: 1, frequency: "daily" },
  { id: "4", name: "Drink 8 glasses water", icon: "💧", color: "#06b6d4", streak: 5, completedDates: [], target: 8, frequency: "daily" },
  { id: "5", name: "No social media", icon: "📵", color: "#f43f5e", streak: 3, completedDates: ["2024-03-20"], target: 1, frequency: "daily" },
];

export default function Home() {
  const [habits, setHabits] = useState(sampleHabits);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = format(new Date(), "yyyy-MM-dd");
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(h => {
      if (h.id !== habitId) return h;
      const isCompleted = h.completedDates.includes(today);
      return {
        ...h,
        completedDates: isCompleted
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today],
        streak: isCompleted ? h.streak - 1 : h.streak + 1
      };
    }));
  };

  const totalStreak = habits.reduce((a, h) => a + h.streak, 0);
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRate = Math.round((completedToday / habits.length) * 100);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🔥</span> HabitStack
            </h1>
            <p className="text-muted-foreground mt-1">Build habits that stick</p>
          </div>
          <button className="btn btn-primary"><Plus className="w-4 h-4" /> New Habit</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: Flame, label: "Total Streak", value: totalStreak, color: "#f97316", suffix: " days" },
            { icon: Target, label: "Today", value: `${completedToday}/${habits.length}`, color: "#22c55e" },
            { icon: Zap, label: "Completion", value: completionRate, color: "#8b5cf6", suffix: "%" },
            { icon: Crown, label: "Best Streak", value: 21, color: "#eab308", suffix: " days" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
              <p className="text-2xl font-bold">{stat.value}{stat.suffix}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Week View */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 hover:bg-accent rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="font-semibold">{format(weekStart, "MMMM yyyy")}</h2>
            <button className="p-2 hover:bg-accent rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-xl text-center transition-all ${
                  isSameDay(day, selectedDate) ? "bg-primary text-white" : isToday(day) ? "bg-primary/20" : "hover:bg-accent"
                }`}
              >
                <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
                <p className="text-lg font-semibold">{format(day, "d")}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Habits */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Today's Habits</h2>
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today);
            return (
              <div key={habit.id} className="card flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`habit-check ${isCompleted ? "checked" : ""}`}
                  style={{ borderColor: isCompleted ? habit.color : undefined, backgroundColor: isCompleted ? habit.color : undefined }}
                >
                  {isCompleted && <Check className="w-5 h-5 text-white" />}
                </button>
                <span className="text-2xl">{habit.icon}</span>
                <div className="flex-1">
                  <h3 className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>{habit.name}</h3>
                  <p className="text-sm text-muted-foreground">{habit.frequency}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-full">
                  <Flame className="w-4 h-4 text-orange-500 streak-flame" />
                  <span className="text-orange-500 font-semibold">{habit.streak}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Banner */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-400" /> Go Premium</h3>
              <p className="text-muted-foreground mt-1">Unlimited habits, detailed analytics, and reminders</p>
            </div>
            <button className="btn btn-primary">Upgrade $4.99/mo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
