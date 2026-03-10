"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(7, "Phone number is too short")
      .regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid phone number with country code (e.g. +2348012345678)"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  role: "MENTOR" | "MENTEE";
}

export function SignupForm({ role }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isMentor = role === "MENTOR";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Sign up with email — Supabase sends a 6-digit OTP to the email address
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { role, phone: data.phone },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    window.location.href = `/verify?email=${encodeURIComponent(data.email)}&type=${role === "MENTOR" ? "mentor" : "mentee"}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {isMentor ? "Create a Mentor account" : "Create a Mentee account"}
        </CardTitle>
        <CardDescription>
          {isMentor
            ? "Join as a mentor and start shaping careers"
            : "Join as a mentee and find your perfect mentor"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
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

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+2348012345678"
              {...register("phone")}
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g. +234 for Nigeria, +44 for UK)
            </p>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
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
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={isMentor ? "/login/mentor" : "/login/mentee"}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Not a {isMentor ? "mentor" : "mentee"}?{" "}
          <Link
            href={isMentor ? "/signup/mentee" : "/signup/mentor"}
            className="font-medium text-primary hover:underline"
          >
            Sign up as a {isMentor ? "mentee" : "mentor"}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
