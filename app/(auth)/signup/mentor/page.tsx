import Link from "next/link";
import { MentorSignupForm } from "@/components/auth/MentorSignupForm";

export default function MentorSignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link href="/" className="text-3xl font-bold text-primary">
            MentorKonnect
          </Link>
          <p className="mt-2 text-muted-foreground">
            Create your mentor profile and start connecting
          </p>
        </div>

        {/* Divider with label */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Mentor Sign-Up
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <MentorSignupForm />
      </div>
    </div>
  );
}
