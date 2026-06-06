"use client";

import { useState, useRef, useEffect } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Wind, Moon, Heart } from "lucide-react";
import { getDemoData } from "@/lib/demo-store";
import { getExamMode } from "@/lib/utils";
import { TRIGGER_LABELS } from "@/lib/algorithms/wellness";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  { label: "Breathing Exercise", icon: Wind, prompt: "Guide me through a breathing exercise" },
  { label: "Sleep Tips", icon: Moon, prompt: "I need help sleeping better before my exam" },
  { label: "Motivation", icon: Heart, prompt: "I'm feeling demotivated about my preparation" },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm SweatJoy Coach 🌟 I'm here to support your mental wellness journey. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const demo = getDemoData();
      const mood = demo.moodEntries[0];
      const daysUntilExam = Math.ceil(
        (new Date(demo.profile.target_exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: {
            exam_type: demo.profile.exam_type,
            days_until_exam: daysUntilExam,
            exam_mode: getExamMode(daysUntilExam),
            mood_score: mood?.mood_score,
            emotion: mood?.emotion,
            anxiety_level: mood?.anxiety_level,
            wellness_score: demo.profile.wellness_score,
            recent_triggers: demo.triggers.slice(0, 3).map((t) => TRIGGER_LABELS[t.category]),
          },
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm here for you. Try a 4-7-8 breathing exercise: inhale 4s, hold 7s, exhale 8s. You've got this! 💪",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <AppHeader title="SweatJoy Coach" subtitle="Your AI wellness companion" />

      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map(({ label, icon: Icon, prompt }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => sendMessage(prompt)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <Sparkles className="mb-1 inline h-4 w-4 text-primary" />
                  )}{" "}
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 border-t border-border p-4">
            <Input
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              aria-label="Message to coach"
            />
            <Button variant="wellness" onClick={() => sendMessage(input)} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
