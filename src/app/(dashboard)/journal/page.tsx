"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { JournalEditor, JournalSearch } from "@/components/journal/journal-editor";
import { Card, CardContent } from "@/components/ui/card";
import { addJournal, getDemoData } from "@/lib/demo-store";
import type { Journal } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>(getDemoData().journals);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = journals.filter(
    (j) =>
      !searchQuery ||
      j.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (data: {
    prompt: string;
    content: string;
    emoji_reflection?: string;
    is_draft: boolean;
  }) => {
    const journal = addJournal({
      user_id: "demo",
      ...data,
      entry_date: new Date().toISOString().split("T")[0],
    });
    setJournals([journal, ...journals]);
    toast.success(data.is_draft ? "Draft saved" : "Journal entry saved! +15 XP");
  };

  return (
    <div>
      <AppHeader title="Emotional Journal" subtitle="Reflect on your day, your way" />
      <div className="grid gap-6 lg:grid-cols-2">
        <JournalEditor onSave={handleSave} />
        <div className="space-y-4">
          <JournalSearch onSearch={setSearchQuery} />
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No journal entries yet. Start reflecting!
                </CardContent>
              </Card>
            ) : (
              filtered.map((j) => (
                <Card key={j.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{j.prompt}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(j.entry_date)}
                          {j.is_draft && " · Draft"}
                        </p>
                      </div>
                      <span className="text-xl">{j.emoji_reflection ?? "📝"}</span>
                    </div>
                    <p className="mt-3 text-sm text-foreground/80 line-clamp-3">{j.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
