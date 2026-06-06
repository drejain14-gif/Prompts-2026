"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JOURNAL_PROMPTS } from "@/lib/algorithms/wellness";
import { Save, Search } from "lucide-react";

interface JournalEditorProps {
  onSave: (data: { prompt: string; content: string; emoji_reflection?: string; is_draft: boolean }) => void;
  initialContent?: string;
  initialPrompt?: string;
}

export function JournalEditor({ onSave, initialContent = "", initialPrompt }: JournalEditorProps) {
  const [prompt, setPrompt] = useState(initialPrompt ?? JOURNAL_PROMPTS[0]);
  const [content, setContent] = useState(initialContent);
  const [emoji, setEmoji] = useState("📝");

  const emojis = ["📝", "😊", "😔", "💪", "🙏", "✨", "😌", "🎯"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reflection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Today&apos;s Prompt</Label>
          <select
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm"
            aria-label="Journal prompt"
          >
            {JOURNAL_PROMPTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Your Reflection</Label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write freely — there's no wrong answer..."
            className="min-h-[160px] w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Journal content"
          />
        </div>

        <div className="space-y-2">
          <Label>Emoji Reflection</Label>
          <div className="flex gap-2" role="radiogroup" aria-label="Emoji reflection">
            {emojis.map((e) => (
              <button
                key={e}
                type="button"
                role="radio"
                aria-checked={emoji === e}
                onClick={() => setEmoji(e)}
                className={`rounded-lg p-2 text-xl transition-all ${emoji === e ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-secondary"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="wellness"
            className="flex-1"
            onClick={() => onSave({ prompt, content, emoji_reflection: emoji, is_draft: false })}
            disabled={!content.trim()}
          >
            <Save className="h-4 w-4" />
            Save Entry
          </Button>
          <Button
            variant="outline"
            onClick={() => onSave({ prompt, content, emoji_reflection: emoji, is_draft: true })}
          >
            Save Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function JournalSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search journal entries..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="pl-10"
        aria-label="Search journals"
      />
    </div>
  );
}
