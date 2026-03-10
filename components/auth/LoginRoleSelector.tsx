"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoginRoleSelector() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const qs = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mb-10 text-center">
        <Link href="/" className="text-3xl font-bold text-primary">
          MentorKonnect
        </Link>
        <p className="mt-2 text-muted-foreground">Sign in to your account</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Mentor */}
        <Link href={`/login/mentor${qs}`} className="group">
          <Card className="h-full border-2 hover:border-primary hover:shadow-md transition-all cursor-pointer">
            <CardContent className="flex flex-col items-center text-center p-10 gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">I&apos;m a Mentor</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to manage your mentees and sessions
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                Sign in <ArrowRight className="h-4 w-4" />
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Mentee */}
        <Link href={`/login/mentee${qs}`} className="group">
          <Card className="h-full border-2 hover:border-primary hover:shadow-md transition-all cursor-pointer">
            <CardContent className="flex flex-col items-center text-center p-10 gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">I&apos;m a Mentee</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to connect with your mentor
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                Sign in <ArrowRight className="h-4 w-4" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
