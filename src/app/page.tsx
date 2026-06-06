import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Brain, Target, Shield } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl wellness-gradient">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SweatJoy</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="wellness" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 py-20 text-center">
          <div className="absolute inset-0 wellness-gradient-soft opacity-50" />
          <div className="relative mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Mental Wellness
              <span className="block bg-gradient-to-r from-wellness-teal to-wellness-purple bg-clip-text text-transparent">
                Companion for Exam Prep
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Track mood, identify stress triggers, prevent burnout, and build healthy habits
              while preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and more.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="wellness" size="lg" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">Try Demo Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-bold">Everything you need to thrive</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, title: "Daily Mood Tracking", desc: "Check in with yourself in 30 seconds" },
              { icon: Brain, title: "AI Wellness Coach", desc: "Personalized support from SweatJoy Coach" },
              { icon: Target, title: "Habit Building", desc: "Streaks, progress rings, and gamification" },
              { icon: Shield, title: "Burnout Detection", desc: "Early warnings before you crash" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 SweatJoy. Built for students, by wellness advocates.</p>
      </footer>
    </div>
  );
}
