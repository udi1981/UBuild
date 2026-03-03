"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button, Input, Card, Alert } from "@ubuilder/ui";

/** Create new site form */
const NewSitePage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("he");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("שם האתר הוא שדה חובה");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          language,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "שגיאה ביצירת האתר");
      }

      router.push("/sites");
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה ביצירת האתר. נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg flex flex-col gap-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.push("/sites")}
        className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors self-start"
      >
        <ArrowRight size={16} className="rotate-180 rtl:rotate-0" />
        <span>חזרה לאתרים</span>
      </button>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-fg">אתר חדש</h1>
        <p className="text-fg-muted mt-1">הזן את פרטי האתר שלך כדי להתחיל</p>
      </div>

      {/* Error alert */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Site name */}
          <Input
            label="שם האתר"
            placeholder="למשל: החנות שלי"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-fg">
              תיאור
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="תיאור קצר של האתר (אופציונלי)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-subtle px-3 py-2 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:border-ring resize-none"
            />
          </div>

          {/* Language selector */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="language" className="text-sm font-medium text-fg">
              שפה
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-bg-subtle px-3 text-sm text-fg transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:border-ring"
            >
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">
              צור אתר
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/sites")}
            >
              ביטול
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewSitePage;
