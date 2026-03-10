import Link from "next/link";
import { Briefcase, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignupRolePage() {
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-0.5">
          <span className="text-2xl font-extrabold text-white">Mentor</span>
          <span className="text-2xl font-extrabold text-orange-400">Konnect</span>
        </Link>
        <div className="relative space-y-5">
          <h2 className="text-3xl font-extrabold text-white leading-snug">
            Start your mentorship<br />
            <span className="text-orange-400">journey today</span>
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-xs">
            Whether you are here to teach or to learn, MentorKonnect has a place for you.
          </p>
          <div className="space-y-3 pt-2">
            {[
              "Free to join",
              "Verified mentor profiles",
              "Flexible scheduling",
              "Real-time messaging",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-blue-100">
                <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-blue-300">
          &copy; {new Date().getFullYear()} MentorKonnect
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 py-16">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-0.5 mb-10 lg:hidden">
          <span className="text-2xl font-extrabold text-blue-700">Mentor</span>
          <span className="text-2xl font-extrabold text-orange-500">Konnect</span>
        </Link>

        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-extrabold text-gray-900">How would you like to join?</h1>
            <p className="mt-2 text-gray-500">Choose your role to get started</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Mentor card */}
            <Link href="/signup/mentor" className="group block">
              <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-8 flex flex-col items-center text-center gap-5 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-500 transition-colors duration-200">
                  <Briefcase className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">I am a Mentor</h2>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Share your expertise and guide the next generation
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 group-hover:gap-2.5 transition-all">
                  Get started <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Mentee card */}
            <Link href="/signup/mentee" className="group block">
              <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-8 flex flex-col items-center text-center gap-5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 group-hover:bg-blue-600 transition-colors duration-200">
                  <GraduationCap className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">I am a Mentee</h2>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Find a mentor and accelerate your growth
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                  Get started <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
