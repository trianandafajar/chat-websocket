"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Languages, Loader2 } from "lucide-react";

const LANGUAGES: { code: string; label: string }[] = [
  { code: "id", label: "Indonesian" },
  { code: "en", label: "English" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ko", label: "Korean" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "ru", label: "Russian" },
];

interface TranslateResult {
  translatedText: string;
  detectedSource: string | null;
  targetCode: string;
}

interface TranslateButtonProps {
  text: string;
  align?: "start" | "end";
  direction?: "up" | "down";
  /** Cached result + setter, owned by parent so it persists per-message */
  cached?: TranslateResult | null;
  onCache?: (result: TranslateResult | null) => void;
}

export function TranslateButton({
  text,
  align = "start",
  direction = "down",
  cached,
  onCache,
}: TranslateButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handlePick = async (code: string) => {
    setOpen(false);
    if (cached?.targetCode === code) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target: code }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const data = await res.json();
      onCache?.({
        translatedText: data.translatedText ?? "",
        detectedSource: data.detectedSource ?? null,
        targetCode: code,
      });
    } catch (err) {
      console.error("translate error", err);
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    onCache?.(null);
    setError(null);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Translate"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Languages className="w-3 h-3" />
          )}
          {cached ? `→ ${cached.targetCode.toUpperCase()}` : "Translate"}
        </button>
        {cached && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10.5px] font-mono text-muted-foreground/70 hover:text-foreground transition cursor-pointer"
            title="Hide translation"
          >
            (hide)
          </button>
        )}
      </div>

      {open && (
        <div
          className={`absolute z-30 w-44 max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-lg ${
            align === "end" ? "right-0" : "left-0"
          } ${direction === "up" ? "bottom-full mb-1" : "top-full mt-1"} [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full`}
        >
          {LANGUAGES.map((lang) => {
            const active = cached?.targetCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handlePick(lang.code)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm transition cursor-pointer ${
                  active
                    ? "bg-primary/10 text-foreground font-medium"
                    : "hover:bg-muted/50 text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] uppercase text-muted-foreground w-7">
                    {lang.code}
                  </span>
                  <span>{lang.label}</span>
                </span>
                {active && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p
          className={`mt-1 text-[10.5px] text-red-600 ${align === "end" ? "text-right" : ""}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export type { TranslateResult };
