"use client";

import { usePromptStore } from "@/lib/store";
import { cn, formatNumber, formatCost } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Star,
  Target,
} from "lucide-react";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];

export function AnalyticsDashboard() {
  const { analytics, setShowAnalyticsModal, prompts, executions } = usePromptStore();

  // Calculate analytics from data
  const totalPrompts = prompts.length;
  const totalExecutions = executions.length;
  const avgRating = prompts.length > 0
    ? prompts.reduce((acc, p) => acc + p.rating, 0) / prompts.length
    : 0;
  const avgSuccessRate = prompts.length > 0
    ? prompts.reduce((acc, p) => acc + p.successRate, 0) / prompts.length
    : 0;
  const totalCost = executions.reduce((acc, e) => acc + e.cost, 0);

  // Mock data for charts
  const executionsByDay = [
    { date: "Mon", count: 45, cost: 0.12 },
    { date: "Tue", count: 52, cost: 0.15 },
    { date: "Wed", count: 38, cost: 0.09 },
    { date: "Thu", count: 65, cost: 0.18 },
    { date: "Fri", count: 48, cost: 0.13 },
    { date: "Sat", count: 32, cost: 0.08 },
    { date: "Sun", count: 28, cost: 0.07 },
  ];

  const categoryData = [
    { name: "Coding", value: prompts.filter(p => p.category === "coding").length || 12 },
    { name: "Writing", value: prompts.filter(p => p.category === "writing").length || 8 },
    { name: "Analysis", value: prompts.filter(p => p.category === "analysis").length || 6 },
    { name: "Creative", value: prompts.filter(p => p.category === "creative").length || 5 },
    { name: "Business", value: prompts.filter(p => p.category === "business").length || 4 },
  ];

  const modelUsage = [
    { model: "GPT-4", count: 150, avgLatency: 2400 },
    { model: "GPT-4 Turbo", count: 89, avgLatency: 1800 },
    { model: "GPT-3.5", count: 45, avgLatency: 800 },
    { model: "Claude 3", count: 32, avgLatency: 2100 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Performance insights and usage metrics</p>
          </div>
          <button
            onClick={() => setShowAnalyticsModal(false)}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 p-6">
          <StatCard
            title="Total Prompts"
            value={totalPrompts || 35}
            change={+12}
            icon={<Target className="w-5 h-5" />}
            color="text-blue-400"
          />
          <StatCard
            title="Executions"
            value={totalExecutions || 316}
            change={+24}
            icon={<Zap className="w-5 h-5" />}
            color="text-green-400"
          />
          <StatCard
            title="Avg Rating"
            value={avgRating.toFixed(1) || "4.2"}
            change={+0.3}
            icon={<Star className="w-5 h-5" />}
            color="text-yellow-400"
            suffix="/5"
          />
          <StatCard
            title="Total Cost"
            value={formatCost(totalCost || 12.45)}
            change={-8}
            icon={<DollarSign className="w-5 h-5" />}
            color="text-purple-400"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 p-6 pt-0">
          {/* Executions Over Time */}
          <div className="p-6 bg-secondary/50 rounded-xl border border-border">
            <h3 className="font-semibold mb-4">Executions Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={executionsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="p-6 bg-secondary/50 rounded-xl border border-border">
            <h3 className="font-semibold mb-4">Prompts by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Model Usage */}
          <div className="p-6 bg-secondary/50 rounded-xl border border-border">
            <h3 className="font-semibold mb-4">Model Usage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={modelUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="model" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Trend */}
          <div className="p-6 bg-secondary/50 rounded-xl border border-border">
            <h3 className="font-semibold mb-4">Cost Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={executionsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Cost"]}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="p-6 pt-0">
          <div className="p-6 bg-secondary/50 rounded-xl border border-border">
            <h3 className="font-semibold mb-4">Top Performing Prompts</h3>
            <div className="space-y-3">
              {prompts
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((prompt, i) => (
                  <div
                    key={prompt.id}
                    className="flex items-center gap-4 p-3 bg-background/50 rounded-lg"
                  >
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{prompt.title}</p>
                      <p className="text-xs text-muted-foreground">{prompt.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{prompt.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prompt.totalRuns} runs
                    </div>
                  </div>
                ))}
              {prompts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No prompts yet. Create your first prompt to see analytics.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  color,
  suffix,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}) {
  const isPositive = change >= 0;

  return (
    <div className="p-5 bg-secondary/50 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className={cn("p-2 rounded-lg bg-current/10", color)}>{icon}</span>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-green-400" : "text-red-400"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold">
        {value}
        {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}
