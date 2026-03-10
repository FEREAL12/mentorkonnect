"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  /** When provided, shows role-specific title and sign-up link. */
  role?: "MENTOR" | "MENTEE";
}

export function LoginForm({ role }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isMentor = role === "MENTOR";
  const isMentee = role === "MENTEE";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    // signIn is a Server Action — it sets the session cookie server-side
    // and calls redirect(), so the browser follows the redirect automatically.
    // If sign-in fails it returns { error } and we land here.
    const result = await signIn(data.email, data.password, role);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // On success, redirect() was thrown inside the server action and the
    // browser already navigated away — no further client code runs.
  };

  const title = isMentor
    ? "Mentor sign in"
    : isMentee
    ? "Mentee sign in"
    : "Welcome back";

  const description = isMentor
    ? "Sign in to manage your mentees and sessions"
    : isMentee
    ? "Sign in to connect with your mentor"
    : "Sign in to your MentorKonnect account";

  const signupHref = isMentor
    ? "/signup/mentor"
    : isMentee
    ? "/signup/mentee"
    : "/signup";

  const signupLabel = isMentor
    ? "Create a mentor account"
    : isMentee
    ? "Create a mentee account"
    : "Sign up";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={signupHref}
            className="font-medium text-primary hover:underline"
          >
            {signupLabel}
          </Link>
        </p>
        {role && (
          <p className="text-sm text-muted-foreground">
            Not a {isMentor ? "mentor" : "mentee"}?{" "}
            <Link
              href={isMentor ? "/login/mentee" : "/login/mentor"}
              className="font-medium text-primary hover:underline"
            >
              Sign in as a {isMentor ? "mentee" : "mentor"}
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
