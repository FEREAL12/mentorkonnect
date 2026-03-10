import { Suspense } from "react";
import Link from "next/link";
import { GraduationCap, Search, TrendingUp } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function MenteeLoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-0.5">
          <span className="text-2xl font-extrabold text-white">Mentor</span>
          <span className="text-2xl font-extrabold text-orange-400">Konnect</span>
        </Link>
        <div className="relative">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-400/30">
            <GraduationCap className="h-7 w-7 text-orange-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Welcome back,<br />Mentee
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            Sign in to connect with your mentor, book sessions, and accelerate your growth.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, label: "Track Progress" },
              { icon: Search, label: "Browse Mentors" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl bg-blue-800/50 border border-blue-700/50 px-4 py-3">
                <Icon className="h-4 w-4 text-orange-400 shrink-0" />
                <span className="text-sm text-blue-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-blue-300">
          &copy; {new Date().getFullYear()} MentorKonnect
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-0.5 mb-10 lg:hidden justify-center">
            <span className="text-2xl font-extrabold text-blue-700">Mentor</span>
            <span className="text-2xl font-extrabold text-orange-500">Konnect</span>
          </Link>
          <Suspense>
            <LoginForm role="MENTEE" />
          </Suspense>
          <p className="mt-6 text-center text-sm text-gray-400">
            Not ready to sign in?{" "}
            <Link
              href="/mentors"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Search className="h-3.5 w-3.5" />
              Browse mentors first
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
