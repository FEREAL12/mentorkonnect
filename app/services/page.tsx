"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Linkedin,
  Briefcase,
  Users,
  Star,
  CheckCircle2,
  Upload,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trophy,
  Target,
  Zap,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ─── Word counter ──────────────────────────────────────────────────────────────
function wordCount(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

// ─── File upload input ─────────────────────────────────────────────────────────
function FileUploadField({
  label,
  accept = ".pdf,.doc,.docx",
  onChange,
  file,
}: {
  label: string;
  accept?: string;
  onChange: (f: File | null) => void;
  file: File | null;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-4 py-3.5 text-sm hover:border-blue-400 hover:bg-blue-50 transition-all"
      >
        <Upload className="h-4 w-4 text-blue-400 shrink-0" />
        <span className={file ? "text-gray-800 font-medium" : "text-gray-400"}>
          {file ? file.name : "Click to upload (PDF, DOC, DOCX)"}
        </span>
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

// ─── Success message ────────────────────────────────────────────────────────────
function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
      </div>
      <div>
        <p className="font-bold text-lg text-gray-900">Request Submitted!</p>
        <p className="text-sm text-gray-500 mt-1">
          Thank you — we&apos;ll be in touch with you shortly.
        </p>
      </div>
      <button
        onClick={onReset}
        className="text-sm text-blue-600 hover:underline font-medium"
      >
        Submit another request
      </button>
    </div>
  );
}

// ─── Shared form wrapper ────────────────────────────────────────────────────────
function FormField({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

// ─── Service forms ──────────────────────────────────────────────────────────────

function CVDesignForm() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Upload your existing CV (optional) and we&apos;ll redesign it professionally — ATS-optimised and industry-tailored.
      </p>
      <FileUploadField label="Upload your current CV (optional)" onChange={setFile} file={file} />
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">
        Request CV Design
      </Button>
    </form>
  );
}

function LinkedInReviewForm() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Enter your full name and we&apos;ll get in touch to review your LinkedIn profile and provide CV feedback.
      </p>
      <FormField>
        <Label htmlFor="li-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
        <Input
          id="li-name"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </FormField>
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">
        Request Review
      </Button>
    </form>
  );
}

function JobSupportForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Apply for our 3-Month Job Support Programme — personalised guidance from application to offer letter.
      </p>
      <FormField>
        <Label htmlFor="js-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
        <Input
          id="js-name"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </FormField>
      <FileUploadField label="Upload your CV (optional)" onChange={setFile} file={file} />
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">
        Apply Now
      </Button>
    </form>
  );
}

const TIME_OPTIONS = [
  { label: "Morning", sub: "9 AM – 12 PM" },
  { label: "Afternoon", sub: "12 PM – 3 PM" },
  { label: "Late Afternoon", sub: "3 PM – 6 PM" },
  { label: "Evening", sub: "6 PM – 9 PM" },
];

function MentorshipSessionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setEmail(""); setTime(""); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !email.trim() || !time) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Book a 1:1 session with one of our expert career mentors and get personalised guidance.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField>
          <Label htmlFor="ms-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
          <Input
            id="ms-name"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 rounded-xl border-gray-200"
          />
        </FormField>
        <FormField>
          <Label htmlFor="ms-email" className="text-sm font-medium text-gray-700">Email Address *</Label>
          <Input
            id="ms-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl border-gray-200"
          />
        </FormField>
      </div>
      <FormField>
        <Label className="text-sm font-medium text-gray-700">Preferred Time *</Label>
        <div className="grid grid-cols-2 gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTime(t.label)}
              className={`flex flex-col items-start gap-0.5 rounded-xl border-2 px-3 py-2.5 text-sm transition-all ${
                time === t.label
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300 text-gray-600"
              }`}
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3 w-3 shrink-0" />
                {t.label}
              </span>
              <span className="text-xs text-gray-400 pl-4">{t.sub}</span>
            </button>
          ))}
        </div>
      </FormField>
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">
        Book Session
      </Button>
    </form>
  );
}

function FutureLeadersForm() {
  const [essay, setEssay] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const words = wordCount(essay);
  const MIN = 180;
  const MAX = 220;
  if (submitted) return <SuccessMessage onReset={() => { setEssay(""); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (words < MIN) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Write a <strong className="text-gray-700">200-word essay</strong> explaining why you want to join the Future Leaders Programme — your ambitions, what leadership means to you, and how this will shape your career.
      </p>
      <FormField>
        <div className="flex items-center justify-between">
          <Label htmlFor="fl-essay" className="text-sm font-medium text-gray-700">Your Essay *</Label>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            words === 0 ? "bg-gray-100 text-gray-400"
            : words < MIN ? "bg-orange-100 text-orange-600"
            : words <= MAX ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
          }`}>
            {words} / 200 words
          </span>
        </div>
        <Textarea
          id="fl-essay"
          placeholder="Tell us why you want to join the Future Leaders Programme…"
          rows={7}
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          className="resize-none rounded-xl border-gray-200"
        />
        {words > 0 && words < MIN && (
          <p className="text-xs text-orange-500">{MIN - words} more words needed</p>
        )}
        {words > MAX && (
          <p className="text-xs text-red-500">{words - MAX} words over limit — please trim</p>
        )}
      </FormField>
      <Button
        type="submit"
        disabled={words < MIN || words > MAX}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold disabled:opacity-50"
      >
        Submit Application
      </Button>
    </form>
  );
}

function BusinessIdeaForm() {
  const [idea, setIdea] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const words = wordCount(idea);
  const MIN = 300;
  const MAX = 500;
  if (submitted) return <SuccessMessage onReset={() => { setIdea(""); setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (words < MIN || words > MAX) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Write a <strong className="text-gray-700">300–500 word pitch</strong> describing your business idea — the problem it solves, your target market, and why you&apos;re the right person to build it. You can also upload a supporting document.
      </p>
      <FormField>
        <div className="flex items-center justify-between">
          <Label htmlFor="bi-idea" className="text-sm font-medium text-gray-700">Your Business Idea *</Label>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            words === 0 ? "bg-gray-100 text-gray-400"
            : words < MIN ? "bg-orange-100 text-orange-600"
            : words <= MAX ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
          }`}>
            {words} / 300–500 words
          </span>
        </div>
        <Textarea
          id="bi-idea"
          placeholder="Describe your business idea, the problem it solves, your target market, and why you're the right person to build it…"
          rows={9}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="resize-none rounded-xl border-gray-200"
        />
        {words > 0 && words < MIN && (
          <p className="text-xs text-orange-500">{MIN - words} more words needed (minimum 300)</p>
        )}
        {words > MAX && (
          <p className="text-xs text-red-500">{words - MAX} words over limit — please trim to 500</p>
        )}
      </FormField>
      <FileUploadField
        label="Supporting Document (optional)"
        onChange={setFile}
        file={file}
      />
      <Button
        type="submit"
        disabled={words < MIN || words > MAX}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold disabled:opacity-50"
      >
        Submit Business Idea
      </Button>
    </form>
  );
}

// ─── Service config ─────────────────────────────────────────────────────────────

type ServiceConfig = {
  id: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  iconBg: string;
  iconColor: string;
  accentBar: string;
  title: string;
  subtitle: string;
  bullets: string[];
  form: React.ReactNode;
};

const SERVICES: ServiceConfig[] = [
  {
    id: "cv-design",
    icon: FileText,
    badge: "Most Popular",
    badgeColor: "bg-orange-100 text-orange-600",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    accentBar: "from-blue-500 to-blue-700",
    title: "Professional CV Design",
    subtitle: "Stand out with a polished, ATS-friendly CV crafted by our experts.",
    bullets: [
      "ATS-optimised formatting",
      "Industry-tailored layout",
      "Delivered within 48 hours",
    ],
    form: <CVDesignForm />,
  },
  {
    id: "linkedin",
    icon: Linkedin,
    badge: "High Demand",
    badgeColor: "bg-blue-100 text-blue-600",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    accentBar: "from-blue-400 to-blue-600",
    title: "LinkedIn + CV Review",
    subtitle: "Elevate your online presence and get expert feedback on your CV.",
    bullets: [
      "Full LinkedIn profile audit",
      "Keyword optimisation",
      "CV critique & suggestions",
    ],
    form: <LinkedInReviewForm />,
  },
  {
    id: "job-support",
    icon: Briefcase,
    badge: "3 Months",
    badgeColor: "bg-orange-100 text-orange-600",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    accentBar: "from-orange-400 to-orange-600",
    title: "3-Month Job Support",
    subtitle: "Dedicated support from application to offer letter.",
    bullets: [
      "Weekly 1:1 check-ins",
      "Interview coaching",
      "Salary negotiation guidance",
    ],
    form: <JobSupportForm />,
  },
  {
    id: "mentorship",
    icon: Users,
    badge: "1:1 Session",
    badgeColor: "bg-blue-100 text-blue-600",
    iconBg: "bg-blue-700",
    iconColor: "text-white",
    accentBar: "from-blue-600 to-blue-800",
    title: "1:1 Career Mentorship",
    subtitle: "Personal guidance from an experienced career mentor.",
    bullets: [
      "60-minute focused sessions",
      "Career strategy planning",
      "Actionable next steps",
    ],
    form: <MentorshipSessionForm />,
  },
  {
    id: "future-leaders",
    icon: Trophy,
    badge: "Exclusive",
    badgeColor: "bg-orange-100 text-orange-700",
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
    iconColor: "text-white",
    accentBar: "from-orange-500 to-orange-700",
    title: "Future Leaders Programme",
    subtitle: "An exclusive cohort programme for ambitious professionals.",
    bullets: [
      "Cohort-based leadership training",
      "Executive mentor access",
      "Limited places available",
    ],
    form: <FutureLeadersForm />,
  },
  {
    id: "business-idea",
    icon: Lightbulb,
    badge: "New",
    badgeColor: "bg-green-100 text-green-700",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
    accentBar: "from-green-400 to-green-600",
    title: "Submit a Business Idea",
    subtitle: "Pitch your business concept and get expert mentor feedback.",
    bullets: [
      "300–500 word written pitch",
      "Reviewed by experienced mentors",
      "Actionable feedback provided",
    ],
    form: <BusinessIdeaForm />,
  },
];

// ─── Service card ───────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceConfig }) {
  const [open, setOpen] = useState(false);
  const Icon = service.icon;

  return (
    <div className={`relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${open ? "shadow-lg" : ""}`}>
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${service.accentBar}`} />

      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* Icon + badge */}
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.iconBg} shadow-sm`}>
            <Icon className={`h-6 w-6 ${service.iconColor}`} />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${service.badgeColor}`}>
            {service.badge}
          </span>
        </div>

        {/* Title + subtitle */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-snug">{service.title}</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{service.subtitle}</p>
        </div>

        {/* Bullets */}
        <ul className="space-y-2 flex-1">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
              {b}
            </li>
          ))}
        </ul>

        {/* Toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center justify-center gap-2 w-full h-11 rounded-xl font-semibold text-sm transition-all ${
            open
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          }`}
        >
          {open ? (
            <>Close <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>Get Started <ChevronDown className="h-4 w-4" /></>
          )}
        </button>

        {/* Expandable form */}
        {open && (
          <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
            {service.form}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "500+", label: "Mentors Available", icon: Users, color: "text-blue-600" },
  { value: "92%", label: "Placement Rate", icon: Target, color: "text-orange-500" },
  { value: "48h", label: "Average Response", icon: Zap, color: "text-blue-600" },
  { value: "4.9★", label: "Average Rating", icon: Star, color: "text-orange-500" },
];

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-extrabold text-blue-700">Mentor</span>
            <span className="text-xl font-extrabold text-orange-500">Konnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Home
            </Link>
            <Link href="/services" className="px-3 py-1.5 text-sm font-semibold text-blue-700 rounded-lg bg-blue-50 transition-colors">
              Services
            </Link>
            <Link href="/mentors" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Browse Mentors
            </Link>
          </nav>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm rounded-xl">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-20 md:py-28">
          {/* Background glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />
          </div>

          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-400/15 border border-orange-400/25 px-4 py-2 text-sm font-semibold text-orange-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Career Services
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Everything you need to
              <br />
              <span className="text-orange-400">land your next role</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200 leading-relaxed">
              From CV design to exclusive leadership programmes — our expert-led services are built to accelerate your career at every stage.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg rounded-xl h-12 px-8 font-semibold">
                <Link href="#services">
                  Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 text-white bg-white/10 hover:bg-white/15 rounded-xl h-12 px-8 font-semibold">
                <Link href="/mentors">Browse Mentors</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-b bg-white">
          <div className="container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center text-center gap-1.5">
                    <Icon className={`h-5 w-5 ${s.color}`} />
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Services grid ── */}
        <section id="services" className="bg-gray-50/60 py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                Choose your <span className="text-blue-700">service</span>
              </h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Select any service below and fill in the quick form — our team will follow up within 24 hours.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band ── */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-16">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                <Trophy className="h-5 w-5 text-orange-400" />
                <span className="text-orange-300 font-semibold text-sm">Not sure where to start?</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Talk to a career expert — free
              </h2>
              <p className="mt-2 text-blue-200 max-w-md">
                Book a complimentary 15-minute discovery call and we&apos;ll point you to the right service.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 h-12 px-8 rounded-xl font-semibold shadow-lg">
                <Link href="/contact">
                  Book Free Call <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 text-white bg-white/10 hover:bg-white/20 h-12 px-8 rounded-xl font-semibold">
                <Link href="/mentors">Browse Mentors</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="font-extrabold text-blue-700">Mentor</span>
            <span className="font-extrabold text-orange-500">Konnect</span>
          </Link>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MentorKonnect. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Home</Link>
            <Link href="/mentors" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Browse Mentors</Link>
            <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
