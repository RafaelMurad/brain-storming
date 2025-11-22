"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { TechGrid } from "@/components/tech-grid";
import { ExerciseGenerator } from "@/components/exercise-generator";
import { ExerciseView } from "@/components/exercise-view";
import { useForgeStore } from "@/lib/store";
import { TECHNOLOGIES, generateId } from "@/lib/utils";
import { Sparkles, Code, Rocket, Github, ArrowRight, Star, Zap, Target } from "lucide-react";

export default function Home() {
  const { view, selectedExercise, setTechnologies, setUser, technologies } = useForgeStore();

  // Initialize with sample data
  useEffect(() => {
    if (technologies.length === 0) {
      setTechnologies(TECHNOLOGIES);
    }

    // Set demo user
    setUser({
      id: generateId(),
      email: "demo@example.com",
      name: "Demo User",
      image: null,
      githubId: null,
      level: 5,
      xp: 2450,
      streak: 7,
    });
  }, [technologies.length, setTechnologies, setUser]);

  // Exercise view
  if (view === "exercise" && selectedExercise) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ExerciseView />
      </div>
    );
  }

  // AI Generator view
  if (view === "generate") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <ExerciseGenerator />
        </main>
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master Frontend Development
              <br />
              <span className="gradient-text">By Building Real Projects</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Learn React, Next.js, Vue, and more through AI-generated exercises.
              Get personalized challenges that create real GitHub repos for hands-on practice.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button className="btn btn-primary py-3 px-6 text-lg">
                <Rocket className="w-5 h-5" />
                Start Learning
              </button>
              <button className="btn btn-secondary py-3 px-6 text-lg">
                <Github className="w-5 h-5" />
                Connect GitHub
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 mt-16">
              {[
                { value: "50+", label: "Exercises" },
                { value: "8", label: "Technologies" },
                { value: "10K+", label: "Learners" },
                { value: "100%", label: "Hands-on" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why FrontendForge?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                The most effective way to learn is by doing. We combine AI with real-world projects.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: "AI-Generated Exercises",
                  description:
                    "Tell us what you want to learn, and our AI creates custom exercises tailored to your goals.",
                  color: "text-primary",
                },
                {
                  icon: <Github className="w-6 h-6" />,
                  title: "Real GitHub Repos",
                  description:
                    "Every exercise creates a real repo you can clone, work on in your IDE, and showcase in your portfolio.",
                  color: "text-white",
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Progressive Learning",
                  description:
                    "Start from basics and progress to advanced topics with structured learning paths and XP rewards.",
                  color: "text-yellow-400",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className={`mb-4 ${feature.color}`}>{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Choose Your Technology</h2>
                <p className="text-muted-foreground">
                  Master the most in-demand frontend technologies
                </p>
              </div>
              <button className="btn btn-ghost text-primary">
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <TechGrid />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="gradient-border p-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Connect your GitHub account and start your learning journey with personalized exercises.
              </p>
              <button className="btn btn-github py-3 px-8 text-lg">
                <Github className="w-5 h-5" />
                Sign in with GitHub
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>FrontendForge - Learn Frontend Development by Building</p>
          <p className="mt-2">Built with Next.js, Tailwind CSS, and AI</p>
        </div>
      </footer>
    </div>
  );
}
