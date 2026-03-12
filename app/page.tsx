import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  MessageSquare,
  Star,
  BookOpen,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Search,
  Zap,
  Code2,
  Cpu,
  Cloud,
  BarChart3,
  Palette,
  Briefcase,
  Megaphone,
  HeartHandshake,
  Target,
  GraduationCap,
} from "lucide-react";
import { getUser } from "@/lib/data/get-user";

const STATS = [
  { value: "500+", label: "Tech Mentors", color: "orange" },
  { value: "2,000+", label: "Professionals Helped", color: "blue" },
  { value: "15,000+", label: "Sessions Completed", color: "orange" },
  { value: "95%", label: "Satisfaction Rate", color: "blue" },
];

const DOMAINS = [
  { icon: Target,        label: "Product Management",       color: "from-violet-500 to-violet-700",   bg: "bg-violet-50",  text: "text-violet-700", border: "border-violet-200" },
  { icon: Palette,       label: "Product Design / UX / UI", color: "from-pink-500 to-pink-700",       bg: "bg-pink-50",    text: "text-pink-700",   border: "border-pink-200" },
  { icon: Cpu,           label: "AI & Machine Learning",    color: "from-blue-500 to-blue-700",       bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200" },
  { icon: Code2,         label: "Software Engineering",     color: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200" },
  { icon: Cloud,         label: "Cloud & DevOps",           color: "from-sky-500 to-sky-700",         bg: "bg-sky-50",     text: "text-sky-700",    border: "border-sky-200" },
  { icon: BarChart3,     label: "Data & Analytics",         color: "from-amber-500 to-amber-700",     bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200" },
  { icon: HeartHandshake,label: "Human Resources",          color: "from-rose-500 to-rose-700",       bg: "bg-rose-50",    text: "text-rose-700",   border: "border-rose-200" },
  { icon: Megaphone,     label: "Marketing & Growth",       color: "from-orange-500 to-orange-700",   bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-200" },
  { icon: Briefcase,     label: "Business & Leadership",    color: "from-indigo-500 to-indigo-700",   bg: "bg-indigo-50",  text: "text-indigo-700", border: "border-indigo-200" },
  { icon: GraduationCap, label: "Career Development",       color: "from-teal-500 to-teal-700",       bg: "bg-teal-50",    text: "text-teal-700",   border: "border-teal-200" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your profile",
    description: "Sign up and tell us your tech background, goals, and the domain you want to grow in.",
  },
  {
    step: "02",
    title: "Browse mentors",
    description: "Explore verified tech mentors filtered by domain, stack, seniority, and availability.",
    href: "/mentors",
  },
  {
    step: "03",
    title: "Book a session",
    description: "Pick a time that works and book a 1:1 session directly on the mentor's profile.",
  },
  {
    step: "04",
    title: "Grow your career",
    description: "Get real guidance from someone who's been in your shoes — no fluff, just impact.",
  },
];

const FEATURES = [
  {
    icon: Users,
    title: "Expert Tech Mentor Matching",
    description: "Get paired with verified mentors who work in your exact domain — from staff engineers to product leaders and AI researchers.",
    color: "blue",
  },
  {
    icon: Calendar,
    title: "Flexible Session Booking",
    description: "See mentor availability and book 1:1 sessions in seconds. No back-and-forth emails.",
    color: "orange",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Messaging",
    description: "Stay connected between sessions. Ask quick questions, share links, and get async feedback.",
    color: "blue",
  },
  {
    icon: BookOpen,
    title: "Structured Programmes",
    description: "Enroll in domain-specific programmes designed to take you from junior to senior, IC to manager, or idea to launch.",
    color: "orange",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor growth with session history, goals, and milestone tracking across your mentorship journey.",
    color: "blue",
  },
  {
    icon: Star,
    title: "Vetted & Verified Mentors",
    description: "Every mentor is reviewed by our team. You get quality guidance from practitioners actively working in tech.",
    color: "orange",
  },
];

export default async function LandingPage() {
  const user = await getUser();
  const role = (user?.user_metadata?.role as string) ?? null;
  const isMentee = !!user && role !== "MENTOR" && role !== "ADMIN";
  const isMentor = !!user && role === "MENTOR";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-extrabold text-blue-700">Mentor</span>
            <span className="text-xl font-extrabold text-orange-500">Konnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "#domains",      label: "Domains" },
              { href: "#how-it-works", label: "How it works" },
              { href: "/services",     label: "Services" },
              { href: "/mentors",      label: "Browse Mentors" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {isMentee && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/mentors">Browse Mentors</Link>
              </Button>
            )}
            {isMentor && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
            )}
            {!user && (
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-24 md:py-36">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-violet-400/15 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />
          </div>
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 mb-8">
              <Zap className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">500+ verified tech mentors — 10 domains</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
              Level up your{" "}
              <span className="text-orange-400">tech career</span>
              <br />with a mentor who&apos;s done it
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200 md:text-xl leading-relaxed">
              Connect with senior engineers, product managers, AI researchers, UX leaders, and more.
              Real 1:1 guidance from practitioners in the roles you&apos;re aiming for.
            </p>
            <form action="/mentors" method="GET"
              className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-2xl shadow-blue-950/40">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input name="q" type="text"
                placeholder="Search by skill, role, or tech stack…"
                className="flex-1 bg-transparent py-1 text-sm text-gray-800 outline-none placeholder:text-gray-400" />
              <button type="submit"
                className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                Search
              </button>
            </form>
            <p className="mt-4 text-sm text-blue-300">
              or{" "}
              <Link href="/mentors" className="font-medium text-white underline underline-offset-4 hover:text-orange-300 transition-colors">
                browse all mentors
              </Link>
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user && (
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-8 h-12 text-base font-semibold shadow-lg shadow-orange-500/30">
                  <Link href="/signup">Find My Mentor</Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-8 h-12 text-base font-semibold">
                <Link href="/signup/mentor">Become a Mentor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="bg-white py-14 border-b">
          <div className="container">
            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-4xl font-extrabold md:text-5xl tabular-nums ${stat.color === "orange" ? "text-orange-500" : "text-blue-600"}`}>
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-400 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Domains ── */}
        <section id="domains" className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <div className="text-center mb-14">
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-4">
                10 Specialist Domains
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
                Find a mentor in your field
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Whether you&apos;re breaking into tech, switching roles, or levelling up — we have mentors across every major discipline.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {DOMAINS.map(({ icon: Icon, label, color, bg, text, border }) => (
                <Link key={label} href={`/mentors?q=${encodeURIComponent(label)}`}
                  className={`group flex flex-col items-center gap-3 rounded-2xl border-2 ${border} ${bg} px-4 py-5 hover:shadow-md transition-all hover:-translate-y-0.5`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-sm`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-center text-xs font-semibold leading-snug ${text}`}>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-20 md:py-28 bg-white">
          <div className="container">
            <div className="text-center mb-14">
              <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
                Platform Features
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
                Everything you need to grow in tech
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                From finding the right mentor to booking sessions and getting async support — MentorKonnect has it all.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title}
                  className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-blue-100 transition-all hover:-translate-y-1 duration-300 p-6">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl mb-4 ${
                    feature.color === "orange" ? "bg-orange-100 text-orange-500" : "bg-blue-100 text-blue-600"
                  }`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="bg-gray-50 py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-14">
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
                How MentorKonnect works
              </h2>
              <p className="mt-4 text-lg text-gray-500">Go from sign-up to booked session in minutes</p>
            </div>
            <div className="relative grid gap-10 md:grid-cols-4">
              <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-orange-200 via-blue-200 to-orange-200" />
              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.step} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                  <div className={`relative z-10 mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${i % 2 === 0 ? "bg-orange-500" : "bg-blue-600"}`}>
                    {item.step}
                  </div>
                  {"href" in item && item.href ? (
                    <Link href={item.href} className="mb-2 font-bold text-gray-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                      {item.title} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <h3 className="mb-2 font-bold text-gray-900">{item.title}</h3>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mentor CTA ── */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-10 py-16 text-center md:px-16 md:py-20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
              </div>
              <div className="relative">
                <span className="inline-block rounded-full border border-orange-400/40 bg-orange-500/15 px-4 py-1 text-sm font-semibold text-orange-300 mb-6">
                  For Tech Professionals
                </span>
                <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                  Share your expertise.{" "}
                  <span className="text-orange-400">Shape the next generation.</span>
                </h2>
                <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Join hundreds of tech professionals who mentor the next wave of engineers, PMs, designers, and leaders.
                  Set your own availability and make a lasting impact.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  {["Free to join", "Set your own schedule", "Give back to the community"].map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm text-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-10 h-12 text-base font-semibold shadow-lg shadow-orange-500/30">
                    <Link href="/signup/mentor">
                      Become a Mentor <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-10">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-lg font-extrabold text-blue-700">Mentor</span>
              <span className="text-lg font-extrabold text-orange-500">Konnect</span>
            </Link>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} MentorKonnect. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Contact"].map((label) => (
                <Link key={label} href="#" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
