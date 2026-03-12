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
  GraduationCap,
  Award,
  Medal,
  Code2,
  Cpu,
  Cloud,
  BarChart3,
  Palette,
  Megaphone,
  HeartHandshake,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function wordCount(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function FileUploadField({ label, accept = ".pdf,.doc,.docx", onChange, file }: {
  label: string; accept?: string; onChange: (f: File | null) => void; file: File | null;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <button type="button" onClick={() => ref.current?.click()}
        className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-4 py-3.5 text-sm hover:border-blue-400 hover:bg-blue-50 transition-all">
        <Upload className="h-4 w-4 text-blue-400 shrink-0" />
        <span className={file ? "text-gray-800 font-medium" : "text-gray-400"}>
          {file ? file.name : "Click to upload (PDF, DOC, DOCX)"}
        </span>
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </div>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
      </div>
      <div>
        <p className="font-bold text-lg text-gray-900">Request Submitted!</p>
        <p className="text-sm text-gray-500 mt-1">Thank you — we&apos;ll be in touch shortly.</p>
      </div>
      <button onClick={onReset} className="text-sm text-blue-600 hover:underline font-medium">
        Submit another request
      </button>
    </div>
  );
}

function FormField({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

// ─── Forms ───────────────────────────────────────────────────────────────────────

function CVDesignForm() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Upload your existing CV and we&apos;ll redesign it for the tech industry — ATS-optimised, role-specific, and recruiter-ready.
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
        Get your LinkedIn profile audited by a tech industry expert — keyword-optimised to attract the right recruiters and opportunities.
      </p>
      <FormField>
        <Label htmlFor="li-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
        <Input id="li-name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required
          className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400" />
      </FormField>
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">
        Request Review
      </Button>
    </form>
  );
}

const JOB_ROLES = ["Software Engineer", "Product Manager", "UX / Product Designer", "Data / AI Engineer", "Cloud / DevOps", "Engineering Manager", "Other"];

function TechJobSupportForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setRole(""); setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !role) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        3-month personalised job search support — from application strategy and interview prep to offer negotiation in the tech sector.
      </p>
      <FormField>
        <Label htmlFor="js-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
        <Input id="js-name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
      </FormField>
      <FormField>
        <Label className="text-sm font-medium text-gray-700">Target Role *</Label>
        <div className="grid grid-cols-2 gap-2">
          {JOB_ROLES.map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`text-left rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all ${role === r ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-orange-300 text-gray-600"}`}>
              {r}
            </button>
          ))}
        </div>
      </FormField>
      <FileUploadField label="Upload your CV (optional)" onChange={setFile} file={file} />
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">Apply Now</Button>
    </form>
  );
}

const TIME_OPTIONS = [
  { label: "Morning",        sub: "9 AM – 12 PM" },
  { label: "Afternoon",      sub: "12 PM – 3 PM" },
  { label: "Late Afternoon", sub: "3 PM – 6 PM" },
  { label: "Evening",        sub: "6 PM – 9 PM" },
];

function MentorshipSessionForm() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [time, setTime] = useState(""); const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setEmail(""); setTime(""); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !email.trim() || !time) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">Book a 1:1 session with one of our expert tech mentors for personalised career guidance.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField>
          <Label htmlFor="ms-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
          <Input id="ms-name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
        <FormField>
          <Label htmlFor="ms-email" className="text-sm font-medium text-gray-700">Email Address *</Label>
          <Input id="ms-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
      </div>
      <FormField>
        <Label className="text-sm font-medium text-gray-700">Preferred Time *</Label>
        <div className="grid grid-cols-2 gap-2">
          {TIME_OPTIONS.map((t) => (
            <button key={t.label} type="button" onClick={() => setTime(t.label)}
              className={`flex flex-col items-start gap-0.5 rounded-xl border-2 px-3 py-2.5 text-sm transition-all ${time === t.label ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 text-gray-600"}`}>
              <span className="flex items-center gap-1.5 font-medium"><Clock className="h-3 w-3 shrink-0" />{t.label}</span>
              <span className="text-xs text-gray-400 pl-4">{t.sub}</span>
            </button>
          ))}
        </div>
      </FormField>
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">Book Session</Button>
    </form>
  );
}

function TechLeadersForm() {
  const [essay, setEssay] = useState(""); const [submitted, setSubmitted] = useState(false);
  const words = wordCount(essay); const MIN = 180; const MAX = 220;
  if (submitted) return <SuccessMessage onReset={() => { setEssay(""); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (words < MIN) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Write a <strong className="text-gray-700">200-word essay</strong> on your leadership ambitions in tech — what you want to lead, how you&apos;ll get there, and the impact you want to make.
      </p>
      <FormField>
        <div className="flex items-center justify-between">
          <Label htmlFor="fl-essay" className="text-sm font-medium text-gray-700">Your Essay *</Label>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${words === 0 ? "bg-gray-100 text-gray-400" : words < MIN ? "bg-orange-100 text-orange-600" : words <= MAX ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {words} / 200 words
          </span>
        </div>
        <Textarea id="fl-essay" placeholder="Describe your vision for tech leadership…" rows={7} value={essay} onChange={(e) => setEssay(e.target.value)} className="resize-none rounded-xl border-gray-200" />
        {words > 0 && words < MIN && <p className="text-xs text-orange-500">{MIN - words} more words needed</p>}
        {words > MAX && <p className="text-xs text-red-500">{words - MAX} words over limit — please trim</p>}
      </FormField>
      <Button type="submit" disabled={words < MIN || words > MAX} className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold disabled:opacity-50">Submit Application</Button>
    </form>
  );
}

function BusinessIdeaForm() {
  const [idea, setIdea] = useState(""); const [file, setFile] = useState<File | null>(null); const [submitted, setSubmitted] = useState(false);
  const words = wordCount(idea); const MIN = 300; const MAX = 500;
  if (submitted) return <SuccessMessage onReset={() => { setIdea(""); setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (words < MIN || words > MAX) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Write a <strong className="text-gray-700">300–500 word pitch</strong> for your tech startup or product idea. Include the problem, solution, market, and why you&apos;re the right person to build it.
      </p>
      <FormField>
        <div className="flex items-center justify-between">
          <Label htmlFor="bi-idea" className="text-sm font-medium text-gray-700">Your Pitch *</Label>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${words === 0 ? "bg-gray-100 text-gray-400" : words < MIN ? "bg-orange-100 text-orange-600" : words <= MAX ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {words} / 300–500 words
          </span>
        </div>
        <Textarea id="bi-idea" placeholder="Describe your tech startup idea or product concept…" rows={9} value={idea} onChange={(e) => setIdea(e.target.value)} className="resize-none rounded-xl border-gray-200" />
        {words > 0 && words < MIN && <p className="text-xs text-orange-500">{MIN - words} more words needed (minimum 300)</p>}
        {words > MAX && <p className="text-xs text-red-500">{words - MAX} words over limit — please trim to 500</p>}
      </FormField>
      <FileUploadField label="Supporting Document / Deck (optional)" onChange={setFile} file={file} />
      <Button type="submit" disabled={words < MIN || words > MAX} className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold disabled:opacity-50">Submit Idea</Button>
    </form>
  );
}

const INTERNSHIP_AREAS = ["Software Engineering", "Product Management", "UX / Design", "Data & AI", "Cloud / DevOps", "Marketing & Growth", "HR & People Ops", "Other"];

function InternshipSupportForm() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [area, setArea] = useState(""); const [file, setFile] = useState<File | null>(null); const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setEmail(""); setArea(""); setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !email.trim() || !area) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">Land a tech internship with expert coaching — targeted applications, technical interview prep, and take-home challenge support.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField>
          <Label htmlFor="int-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
          <Input id="int-name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
        <FormField>
          <Label htmlFor="int-email" className="text-sm font-medium text-gray-700">Email Address *</Label>
          <Input id="int-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
      </div>
      <FormField>
        <Label className="text-sm font-medium text-gray-700">Target Area *</Label>
        <div className="grid grid-cols-2 gap-2">
          {INTERNSHIP_AREAS.map((a) => (
            <button key={a} type="button" onClick={() => setArea(a)}
              className={`text-left rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all ${area === a ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-purple-300 text-gray-600"}`}>
              {a}
            </button>
          ))}
        </div>
      </FormField>
      <FileUploadField label="Upload CV (optional)" onChange={setFile} file={file} />
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">Apply for Internship Support</Button>
    </form>
  );
}

const GRADUATE_SECTORS = ["Big Tech (FAANG / MAANG)", "Scale-up / Startup", "Consulting (Tech)", "FinTech", "AI & Deep Tech", "Gaming & Media", "Public Sector / GovTech", "Other"];

function GraduateTraineeForm() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [sector, setSector] = useState(""); const [file, setFile] = useState<File | null>(null); const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setEmail(""); setSector(""); setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !email.trim() || !sector) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">Break into top tech graduate schemes — we help you choose the right programmes, ace online assessments, and prepare for technical and behavioural interviews.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField>
          <Label htmlFor="gt-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
          <Input id="gt-name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
        <FormField>
          <Label htmlFor="gt-email" className="text-sm font-medium text-gray-700">Email Address *</Label>
          <Input id="gt-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
      </div>
      <FormField>
        <Label className="text-sm font-medium text-gray-700">Target Sector *</Label>
        <div className="grid grid-cols-2 gap-2">
          {GRADUATE_SECTORS.map((s) => (
            <button key={s} type="button" onClick={() => setSector(s)}
              className={`text-left rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all ${sector === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 text-gray-600"}`}>
              {s}
            </button>
          ))}
        </div>
      </FormField>
      <FileUploadField label="Upload CV (optional)" onChange={setFile} file={file} />
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold">Apply for Graduate Support</Button>
    </form>
  );
}

function ScholarshipSupportForm() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [statement, setStatement] = useState(""); const [file, setFile] = useState<File | null>(null); const [submitted, setSubmitted] = useState(false);
  const words = wordCount(statement); const MIN = 100; const MAX = 250;
  if (submitted) return <SuccessMessage onReset={() => { setName(""); setEmail(""); setStatement(""); setFile(null); setSubmitted(false); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !email.trim() || words < MIN) return; setSubmitted(true); }} className="space-y-4 pt-5">
      <p className="text-sm text-gray-500 leading-relaxed">Win tech scholarships and fellowships — Google, Chevening, Commonwealth, and more. We support your personal statement and application strategy.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <FormField>
          <Label htmlFor="sch-name" className="text-sm font-medium text-gray-700">Full Name *</Label>
          <Input id="sch-name" placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
        <FormField>
          <Label htmlFor="sch-email" className="text-sm font-medium text-gray-700">Email Address *</Label>
          <Input id="sch-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl border-gray-200" />
        </FormField>
      </div>
      <FormField>
        <div className="flex items-center justify-between">
          <Label htmlFor="sch-statement" className="text-sm font-medium text-gray-700">Personal Statement * <span className="font-normal text-gray-400">(100–250 words)</span></Label>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${words === 0 ? "bg-gray-100 text-gray-400" : words < MIN ? "bg-orange-100 text-orange-600" : words <= MAX ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{words} words</span>
        </div>
        <Textarea id="sch-statement" placeholder="Tell us about your background, tech interests, and the scholarship or fellowship you're targeting…" rows={6}
          value={statement} onChange={(e) => setStatement(e.target.value)} className="resize-none rounded-xl border-gray-200" />
        {words > 0 && words < MIN && <p className="text-xs text-orange-500">{MIN - words} more words needed</p>}
        {words > MAX && <p className="text-xs text-red-500">{words - MAX} words over limit — please trim</p>}
      </FormField>
      <FileUploadField label="Supporting Document (optional)" onChange={setFile} file={file} />
      <Button type="submit" disabled={words < MIN || words > MAX} className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-11 rounded-xl font-semibold disabled:opacity-50">Apply for Scholarship Support</Button>
    </form>
  );
}

// ─── Service config ───────────────────────────────────────────────────────────────

type ServiceConfig = {
  id: string; icon: React.ElementType; badge: string; badgeColor: string;
  iconBg: string; iconColor: string; accentBar: string;
  title: string; subtitle: string; bullets: string[]; form: React.ReactNode;
};

const SERVICES: ServiceConfig[] = [
  {
    id: "cv-design", icon: FileText, badge: "Most Popular", badgeColor: "bg-orange-100 text-orange-600",
    iconBg: "bg-blue-600", iconColor: "text-white", accentBar: "from-blue-500 to-blue-700",
    title: "CV Design",
    subtitle: "A recruiter-ready, ATS-optimised CV built for software, product, design, and data roles.",
    bullets: ["ATS-optimised for tech roles", "Domain-specific formatting", "Delivered within 48 hours"],
    form: <CVDesignForm />,
  },
  {
    id: "linkedin", icon: Linkedin, badge: "High Demand", badgeColor: "bg-blue-100 text-blue-600",
    iconBg: "bg-blue-500", iconColor: "text-white", accentBar: "from-blue-400 to-blue-600",
    title: "LinkedIn + CV Review",
    subtitle: "Get your profile and CV audited by someone who knows what tech recruiters look for.",
    bullets: ["Full LinkedIn audit", "Tech keyword optimisation", "CV critique & suggestions"],
    form: <LinkedInReviewForm />,
  },
  {
    id: "job-support", icon: Briefcase, badge: "3 Months", badgeColor: "bg-orange-100 text-orange-600",
    iconBg: "bg-orange-500", iconColor: "text-white", accentBar: "from-orange-400 to-orange-600",
    title: "3-Month Job Support",
    subtitle: "End-to-end support to land a tech role — from application strategy to offer negotiation.",
    bullets: ["Weekly 1:1 coaching", "Technical interview prep", "Offer & salary negotiation"],
    form: <TechJobSupportForm />,
  },
  {
    id: "mentorship", icon: Users, badge: "1:1 Session", badgeColor: "bg-blue-100 text-blue-600",
    iconBg: "bg-blue-700", iconColor: "text-white", accentBar: "from-blue-600 to-blue-800",
    title: "1:1 Mentorship",
    subtitle: "Personalised guidance from a senior professional in your target role or domain.",
    bullets: ["60-minute focused sessions", "Role-specific career strategy", "Actionable feedback"],
    form: <MentorshipSessionForm />,
  },
  {
    id: "tech-leaders", icon: Trophy, badge: "Exclusive", badgeColor: "bg-orange-100 text-orange-700",
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-600", iconColor: "text-white", accentBar: "from-orange-500 to-orange-700",
    title: "Future Leaders Programme",
    subtitle: "An exclusive cohort for aspiring engineering managers, heads of product, and tech leads.",
    bullets: ["Cohort-based leadership training", "Senior mentor access", "Limited places available"],
    form: <TechLeadersForm />,
  },
  {
    id: "business-idea", icon: Lightbulb, badge: "Founders", badgeColor: "bg-green-100 text-green-700",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700", iconColor: "text-white", accentBar: "from-green-400 to-green-600",
    title: "Submit a Startup Idea",
    subtitle: "Pitch your tech product or startup idea and get structured feedback from experienced mentors.",
    bullets: ["300–500 word written pitch", "Reviewed by tech mentors", "Actionable product feedback"],
    form: <BusinessIdeaForm />,
  },
  {
    id: "internships", icon: GraduationCap, badge: "Early Career", badgeColor: "bg-purple-100 text-purple-700",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700", iconColor: "text-white", accentBar: "from-purple-400 to-purple-700",
    title: "Internship Support",
    subtitle: "Land a tech internship at a startup, scale-up, or big tech company with expert coaching.",
    bullets: ["Application coaching", "Technical interview prep", "Take-home challenge support"],
    form: <InternshipSupportForm />,
  },
  {
    id: "graduate-trainee", icon: Award, badge: "Graduate", badgeColor: "bg-blue-100 text-blue-700",
    iconBg: "bg-gradient-to-br from-blue-600 to-blue-800", iconColor: "text-white", accentBar: "from-blue-500 to-blue-800",
    title: "Graduate Scheme Support",
    subtitle: "Navigate top tech graduate programmes at Google, Microsoft, Amazon, and more.",
    bullets: ["Scheme shortlisting & strategy", "Assessment centre coaching", "Technical & behavioural prep"],
    form: <GraduateTraineeForm />,
  },
  {
    id: "scholarships", icon: Medal, badge: "Funding", badgeColor: "bg-amber-100 text-amber-700",
    iconBg: "bg-gradient-to-br from-amber-400 to-amber-600", iconColor: "text-white", accentBar: "from-amber-400 to-amber-600",
    title: "Scholarships & Fellowships",
    subtitle: "Win tech scholarships and fellowships — Google, Chevening, Commonwealth, and more.",
    bullets: ["Personalised opportunity matching", "Personal statement coaching", "Application & essay review"],
    form: <ScholarshipSupportForm />,
  },
];

// ─── Domain highlights ─────────────────────────────────────────────────────────────

const DOMAIN_HIGHLIGHTS = [
  { icon: Code2,          label: "Software Engineering",     color: "from-emerald-500 to-emerald-700" },
  { icon: Target,         label: "Product Management",       color: "from-violet-500 to-violet-700" },
  { icon: Palette,        label: "Product Design / UX",      color: "from-pink-500 to-pink-700" },
  { icon: Cpu,            label: "AI & Machine Learning",    color: "from-blue-500 to-blue-700" },
  { icon: Cloud,          label: "Cloud & DevOps",           color: "from-sky-500 to-sky-700" },
  { icon: BarChart3,      label: "Data & Analytics",         color: "from-amber-500 to-amber-700" },
  { icon: HeartHandshake, label: "Human Resources",          color: "from-rose-500 to-rose-700" },
  { icon: Megaphone,      label: "Marketing & Growth",       color: "from-orange-500 to-orange-700" },
  { icon: Briefcase,      label: "Business & Leadership",    color: "from-indigo-500 to-indigo-700" },
  { icon: BookOpen,       label: "Career Development",       color: "from-teal-500 to-teal-700" },
];

// ─── Service card ──────────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceConfig }) {
  const [open, setOpen] = useState(false);
  const Icon = service.icon;
  return (
    <div className={`relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${open ? "shadow-lg" : ""}`}>
      <div className={`h-1 w-full bg-gradient-to-r ${service.accentBar}`} />
      <div className="p-6 flex flex-col gap-5 flex-1">
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.iconBg} shadow-sm`}>
            <Icon className={`h-6 w-6 ${service.iconColor}`} />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${service.badgeColor}`}>{service.badge}</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-snug">{service.title}</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{service.subtitle}</p>
        </div>
        <ul className="space-y-2 flex-1">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />{b}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setOpen((v) => !v)}
          className={`flex items-center justify-center gap-2 w-full h-11 rounded-xl font-semibold text-sm transition-all ${open ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"}`}>
          {open ? <>Close <ChevronUp className="h-4 w-4" /></> : <>Get Started <ChevronDown className="h-4 w-4" /></>}
        </button>
        {open && (
          <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
            {service.form}
          </div>
        )}
      </div>
    </div>
  );
}

const STATS = [
  { value: "500+", label: "Tech Mentors",       icon: Users,    color: "text-blue-600" },
  { value: "10",   label: "Specialist Domains",  icon: Target,   color: "text-orange-500" },
  { value: "48h",  label: "Avg. Response Time",  icon: Zap,      color: "text-blue-600" },
  { value: "4.9★", label: "Average Rating",      icon: Star,     color: "text-orange-500" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────────

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
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">Home</Link>
            <Link href="/services" className="px-3 py-1.5 text-sm font-semibold text-blue-700 rounded-lg bg-blue-50 transition-colors">Services</Link>
            <Link href="/mentors" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">Browse Mentors</Link>
          </nav>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm rounded-xl">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
          </div>
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-400/15 border border-orange-400/25 px-4 py-2 text-sm font-semibold text-orange-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Tech Career Services
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Expert support for every
              <br />
              <span className="text-orange-400">stage of your tech career</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200 leading-relaxed">
              From landing your first internship to becoming an engineering leader — our services are built by tech professionals, for tech professionals.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg rounded-xl h-12 px-8 font-semibold">
                <Link href="#services">Explore Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
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

        {/* ── Domain pills ── */}
        <section className="bg-gray-50 py-10 border-b">
          <div className="container">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">We cover all major tech domains</p>
            <div className="flex flex-wrap justify-center gap-3">
              {DOMAIN_HIGHLIGHTS.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${color}`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services grid ── */}
        <section id="services" className="bg-white py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                Choose your <span className="text-blue-700">service</span>
              </h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Select any service and fill in the quick form — our team and mentors will follow up within 24 hours.
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
                <Zap className="h-5 w-5 text-orange-400" />
                <span className="text-orange-300 font-semibold text-sm">Not sure where to start?</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Talk to a tech mentor — free</h2>
              <p className="mt-2 text-blue-200 max-w-md">
                Book a complimentary 15-minute discovery call and we&apos;ll point you to the right domain and service.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 h-12 px-8 rounded-xl font-semibold shadow-lg">
                <Link href="/contact">Book Free Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} MentorKonnect. All rights reserved.</p>
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
