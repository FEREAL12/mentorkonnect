"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, X, SlidersHorizontal, MapPin, Monitor, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Skill } from "@prisma/client";
import { useCallback, useState } from "react";
import { COUNTRIES } from "@/lib/constants/countries";

const MENTORING_FORMAT_OPTIONS = [
  { value: "VIRTUAL", label: "Virtual" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "IN_PERSON", label: "In-Person" },
];

interface SearchBarProps {
  skills: Skill[];
  currentQuery?: string;
  currentSkill?: string;
  currentCountry?: string;
  currentFormat?: string;
}

export function SearchBar({
  skills,
  currentQuery,
  currentSkill,
  currentCountry,
  currentFormat,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(currentQuery ?? "");
  const [country, setCountry] = useState(currentCountry ?? "");
  const [format, setFormat] = useState(currentFormat ?? "");
  const [showFilters, setShowFilters] = useState(
    !!(currentCountry || currentFormat || currentSkill)
  );

  const buildParams = useCallback(
    (q: string, skill?: string, c?: string, f?: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (skill) params.set("skill", skill);
      if (c) params.set("country", c);
      if (f) params.set("format", f);
      return params.toString();
    },
    []
  );

  const pushSearch = (
    overrides: { q?: string; skill?: string; country?: string; format?: string } = {}
  ) => {
    const p = buildParams(
      overrides.q ?? query,
      overrides.skill ?? currentSkill,
      overrides.country !== undefined ? overrides.country : country,
      overrides.format !== undefined ? overrides.format : format
    );
    router.push(`${pathname}${p ? `?${p}` : ""}`);
  };

  const clearAll = () => {
    setQuery("");
    setCountry("");
    setFormat("");
    router.push(pathname);
  };

  const activeFilterCount = [currentQuery, currentSkill, currentCountry, currentFormat].filter(Boolean).length;
  const hasFilters = activeFilterCount > 0;

  return (
    <div className="space-y-3">
      {/* ── Search row ── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 h-11 rounded-xl border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400 text-sm"
            placeholder="Search by name, title, skill, country…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") pushSearch(); }}
          />
        </div>

        <button
          onClick={() => pushSearch()}
          className="h-11 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          Search
        </button>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`relative flex items-center gap-1.5 h-11 px-4 rounded-xl border text-sm font-medium transition-all ${
            showFilters
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white px-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Filters panel ── */}
      {showFilters && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Country
              </p>
              <Select
                value={country || "__all__"}
                onValueChange={(v) => {
                  const val = v === "__all__" ? "" : v;
                  setCountry(val);
                  pushSearch({ country: val });
                }}
              >
                <SelectTrigger className="bg-white h-10 rounded-xl border-gray-200">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="__all__">All countries</SelectItem>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format */}
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <Monitor className="h-3.5 w-3.5 text-blue-500" />
                Mentoring Format
              </p>
              <Select
                value={format || "__all__"}
                onValueChange={(v) => {
                  const val = v === "__all__" ? "" : v;
                  setFormat(val);
                  pushSearch({ format: val });
                }}
              >
                <SelectTrigger className="bg-white h-10 rounded-xl border-gray-200">
                  <SelectValue placeholder="Any format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any format</SelectItem>
                  {MENTORING_FORMAT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skill pills */}
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              Area of Expertise
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const active = currentSkill === skill.name;
                return (
                  <button
                    key={skill.id}
                    onClick={() =>
                      pushSearch({ skill: active ? undefined : skill.name })
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                      active
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600"
                    }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Active filter chips ── */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 font-medium">Active:</span>
          {currentQuery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              &ldquo;{currentQuery}&rdquo;
              <button
                onClick={() => { setQuery(""); pushSearch({ q: "" }); }}
                className="ml-0.5 hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentCountry && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {currentCountry}
              <button
                onClick={() => { setCountry(""); pushSearch({ country: "" }); }}
                className="ml-0.5 hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentFormat && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {MENTORING_FORMAT_OPTIONS.find((f) => f.value === currentFormat)?.label ?? currentFormat}
              <button
                onClick={() => { setFormat(""); pushSearch({ format: "" }); }}
                className="ml-0.5 hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentSkill && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-200 px-2.5 py-0.5 text-xs font-medium text-orange-700">
              {currentSkill}
              <button
                onClick={() => pushSearch({ skill: undefined })}
                className="ml-0.5 hover:text-orange-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAll}
            className="text-xs text-red-400 hover:text-red-600 font-medium hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
