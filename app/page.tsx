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
} from "lucide-react";
import { getUser } from "@/lib/data/get-user";

const STATS = [
  { value: "500+", label: "Expert Mentors", color: "orange" },
  { value: "2,000+", label: "Mentees Supported", color: "blue" },
  { value: "15,000+", label: "Sessions Completed", color: "orange" },
  { value: "95%", label: "Satisfaction Rate", color: "blue" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your profile",
    description: "Sign up and tell us about your goals, background, and what you're looking for in a mentor.",
  },
  {
    step: "02",
    title: "Browse mentors",
    description: "Explore our directory of verified mentors, filter by skills, and read their profiles.",
    href: "/mentors",
  },
  {
    step: "03",
    title: "Request a match",
    description: "Send a connection request to your chosen mentor with a short intro message.",
  },
  {
    step: "04",
    title: "Start your journey",
    description: "Once matched, book sessions, message your mentor, and track your progress.",
  },
];

/* ── Animated feature illustrations ── */

function MatchingIllustration() {
  return (
    <div className="relative flex items-center justify-center h-28">
      {/* Mentor avatar */}
      <div className="absolute left-4 flex flex-col items-center gap-1 animate-float-slow">
        <div className="h-12 w-12 rounded-full bg-blue-600 border-4 border-blue-100 flex items-center justify-center shadow-lg">
          <Users className="h-5 w-5 text-white" />
        </div>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Mentor</span>
      </div>

      {/* Connecting dots in the middle */}
      <div className="flex items-center gap-1.5 z-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-orange-400"
            style={{ animation: `ping-slow 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      {/* Mentee avatar */}
      <div className="absolute right-4 flex flex-col items-center gap-1 animate-float">
        <div className="h-12 w-12 rounded-full bg-orange-500 border-4 border-orange-100 flex items-center justify-center shadow-lg">
          <Star className="h-5 w-5 text-white" />
        </div>
        <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Mentee</span>
      </div>

      {/* Match badge */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-3 py-0.5 shadow">
        <CheckCircle2 className="h-3 w-3 text-green-500" />
        <span className="text-[10px] font-semibold text-green-600">Matched!</span>
      </div>
    </div>
  );
}

function BookingIllustration() {
  return (
    <div className="relative flex items-center justify-center h-28">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-3 w-44 animate-float-slow">
        {/* Mini calendar */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-700">March 2025</span>
          <Calendar className="h-3 w-3 text-blue-500" />
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-2">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="text-center text-[8px] text-gray-400 font-medium">{d}</div>
          ))}
          {[...Array(28)].map((_, i) => (
            <div
              key={i}
              className={`text-center text-[8px] rounded py-0.5 font-medium ${
                i === 14 ? "bg-orange-500 text-white" :
                i === 10 || i === 18 ? "bg-blue-100 text-blue-600" :
                "text-gray-500"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping-slow" />
          <span className="text-[9px] text-orange-600 font-semibold">Session booked: 15 Mar</span>
        </div>
      </div>
    </div>
  );
}

function MessagingIllustration() {
  return (
    <div className="flex flex-col gap-2 px-2 h-28 justify-center">
      <div className="flex justify-start animate-slide-left">
        <div className="bg-blue-600 text-white text-[10px] rounded-2xl rounded-tl-none px-3 py-1.5 max-w-[130px] shadow">
          Here is the feedback on your project!
        </div>
      </div>
      <div className="flex justify-end animate-slide-right" style={{ animationDelay: "0.3s" }}>
        <div className="bg-gray-100 text-gray-700 text-[10px] rounded-2xl rounded-tr-none px-3 py-1.5 max-w-[120px] shadow">
          Thank you so much, mentor!
        </div>
      </div>
      <div className="flex justify-start animate-slide-left" style={{ animationDelay: "0.6s" }}>
        <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] rounded-2xl rounded-tl-none px-3 py-1.5 shadow">
          <span>Typing</span>
          <span className="animate-blink">...</span>
        </div>
      </div>
    </div>
  );
}

function ProgrammeIllustration() {
  const steps = ["Intro Session", "Deep Dive", "Project Review", "Final Wrap"];
  return (
    <div className="flex flex-col gap-1.5 px-1 h-28 justify-center">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2 animate-rise" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold shadow ${
            i < 2 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"
          }`}>
            {i < 2 ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
          </div>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
            <div
              className={`h-full rounded-full ${i < 2 ? "bg-orange-500" : i === 2 ? "bg-blue-300" : "bg-gray-200"}`}
              style={{ width: i < 2 ? "100%" : i === 2 ? "40%" : "0%" }}
            />
          </div>
          <span className="text-[9px] text-gray-500 w-20 truncate">{step}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressIllustration() {
  return (
    <div className="flex flex-col gap-2 px-2 h-28 justify-center">
      {[
        { label: "Skills", pct: 78, color: "bg-blue-500" },
        { label: "Sessions", pct: 55, color: "bg-orange-400" },
        { label: "Goals", pct: 90, color: "bg-green-400" },
      ].map(({ label, pct, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-[9px] font-semibold text-gray-500 w-12">{label}</span>
          <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${color} animate-rise`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[9px] font-bold text-gray-600 w-7 text-right">{pct}%</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 mt-1">
        <TrendingUp className="h-3.5 w-3.5 text-green-500 animate-float-slow" />
        <span className="text-[9px] text-green-600 font-semibold">Great progress this week!</span>
      </div>
    </div>
  );
}

function VerifiedIllustration() {
  return (
    <div className="relative flex items-center justify-center h-28">
      {/* Central verified badge */}
      <div className="relative flex flex-col items-center animate-float">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl border-4 border-white">
          <Star className="h-7 w-7 text-yellow-300 fill-yellow-300" />
        </div>
        <div className="mt-1.5 flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 shadow">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span className="text-[9px] font-bold text-green-600">Verified Mentor</span>
        </div>
      </div>
      {/* Orbiting skill tags */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {["React", "Python", "UX"].map((skill, i) => (
          <div
            key={skill}
            className="absolute text-[8px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full shadow-sm"
            style={{
              animation: `orbit ${3 + i}s linear ${i * 1}s infinite`,
              transformOrigin: "center",
            }}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Users,
    title: "Expert Mentor Matching",
    description: "Get paired with verified mentors who have the exact skills and experience you need to achieve your goals.",
    color: "blue",
    illustration: MatchingIllustration,
  },
  {
    icon: Calendar,
    title: "Flexible Session Booking",
    description: "Schedule 1:1 sessions at times that work for both of you. View mentor availability and book in seconds.",
    color: "orange",
    illustration: BookingIllustration,
  },
  {
    icon: MessageSquare,
    title: "Real-Time Messaging",
    description: "Stay connected between sessions with built-in messaging. Get quick answers and ongoing support.",
    color: "blue",
    illustration: MessagingIllustration,
  },
  {
    icon: BookOpen,
    title: "Structured Programmes",
    description: "Enroll in curated mentorship programmes designed to take you from where you are to where you want to be.",
    color: "orange",
    illustration: ProgrammeIllustration,
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor your growth with session history, goals, and milestone tracking across your mentorship journey.",
    color: "blue",
    illustration: ProgressIllustration,
  },
  {
    icon: Star,
    title: "Vetted & Verified Mentors",
    description: "Every mentor is reviewed and verified by our team. You get quality guidance from experienced professionals.",
    color: "orange",
    illustration: VerifiedIllustration,
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
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How it works" },
              { href: "/services", label: "Services" },
              { href: "#find-mentor", label: "Browse Mentors" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
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
        {/* Hero */}
        <section id="find-mentor" className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 py-24 md:py-36">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />
          </div>
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 mb-8">
              <Zap className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">500+ verified mentors ready to help</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
              Find a mentor who{" "}
              <span className="text-orange-400">truly gets it</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200 md:text-xl leading-relaxed">
              MentorKonnect matches ambitious professionals with experienced mentors for structured 1:1 guidance, real-time support, and career-defining breakthroughs.
            </p>
            <form
              action="/mentors"
              method="GET"
              className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-2xl shadow-blue-950/40"
            >
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                name="q"
                type="text"
                placeholder="Search by skill, name, country, or profession..."
                className="flex-1 bg-transparent py-1 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
              >
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
                  <Link href="/signup">Start as a Mentee</Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-8 h-12 text-base font-semibold">
                <Link href="/signup/mentor">Become a Mentor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-16 border-b">
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

        {/* Features with animations */}
        <section id="features" className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-4">
                Platform Features
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
                Everything you need to grow
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                From finding the right mentor to booking sessions and messaging in real-time — MentorKonnect has it all.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Illustration = feature.illustration;
                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border-2 border-transparent bg-white shadow-sm hover:shadow-xl hover:border-blue-100 transition-all hover:-translate-y-1 duration-300 overflow-hidden"
                  >
                    {/* Animated illustration area */}
                    <div className={`px-6 pt-6 pb-2 ${feature.color === "orange" ? "bg-orange-50" : "bg-blue-50"}`}>
                      <Illustration />
                    </div>

                    {/* Card content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          feature.color === "orange" ? "bg-orange-100 text-orange-500" : "bg-blue-100 text-blue-600"
                        }`}>
                          <feature.icon className="h-4.5 w-4.5" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">{feature.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-white py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
                How MentorKonnect works
              </h2>
              <p className="mt-4 text-lg text-gray-500">Get started in just a few simple steps</p>
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
                      {item.title}
                      <ArrowRight className="h-3.5 w-3.5" />
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

        {/* Mentor CTA */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-10 py-16 text-center md:px-16 md:py-20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
              </div>
              <div className="relative">
                <span className="inline-block rounded-full border border-orange-400/40 bg-orange-500/15 px-4 py-1 text-sm font-semibold text-orange-300 mb-6">
                  For Mentors
                </span>
                <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                  Share your expertise.{" "}
                  <span className="text-orange-400">Change lives.</span>
                </h2>
                <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Join hundreds of professionals who give back by mentoring the next generation. Set your own availability and make a lasting impact.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  {["Free to join", "Set your own schedule", "Make a real difference"].map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm text-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-10 h-12 text-base font-semibold shadow-lg shadow-orange-500/30">
                    <Link href="/signup/mentor">
                      Become a Mentor
                      <ArrowRight className="ml-2 h-4 w-4" />
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
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} MentorKonnect. All rights reserved.
            </p>
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
