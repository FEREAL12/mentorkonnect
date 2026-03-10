import { Suspense } from "react";
import Link from "next/link";
import { Briefcase, Users } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function MentorLoginPage() {
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
            <Briefcase className="h-7 w-7 text-orange-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Welcome back,<br />Mentor
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            Sign in to manage your sessions, connect with mentees, and track your impact.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-blue-700 bg-blue-600 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-blue-200" />
                </div>
              ))}
            </div>
            <p className="text-sm text-blue-200">Join 500+ mentors making a difference</p>
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
            <LoginForm role="MENTOR" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
