"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  AlertTriangle,
  Target,
  MessageCircle,
  Scale,
  BarChart3,
  Brain,
  Settings,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mood", label: "Mood", icon: Heart },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/triggers", label: "Triggers", icon: AlertTriangle },
  { href: "/habits", label: "Habits", icon: Target },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/nlp-sessions", label: "NLP Sessions", icon: Brain },
  { href: "/balance", label: "Balance", icon: Scale },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl wellness-gradient">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-foreground">SweatJoy</p>
          <p className="text-xs text-muted-foreground">Mental Wellness</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-card p-2 shadow-md lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6 lg:ml-0">
      <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
