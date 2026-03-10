import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";

export default function MenteeSignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="text-3xl font-bold text-primary">
          MentorKonnect
        </Link>
        <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span className="text-sm">Mentee sign-up</span>
        </div>
      </div>
      <SignupForm role="MENTEE" />
    </div>
  );
}
