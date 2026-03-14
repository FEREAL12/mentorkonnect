"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, RotateCcw, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";


export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const updated = Array(6).fill("");
      pasted.split("").forEach((char, i) => { updated[i] = char; });
      setOtp(updated);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const pendingToken = sessionStorage.getItem("otpPendingToken");
    if (!pendingToken) {
      setError("Session expired. Please sign up again.");
      setIsLoading(false);
      return;
    }

    const res = await fetch("/api/auth/verify-custom-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: code, pendingToken }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body.error ?? "Invalid or expired code. Please try again.");
      setIsLoading(false);
      return;
    }

    sessionStorage.removeItem("otpPendingToken");

    // Set the session in the Supabase client if tokens were returned
    if (body.session) {
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: body.session.access_token,
        refresh_token: body.session.refresh_token,
      });
    }

    window.location.href = "/";
  };

  const handleResend = async () => {
    setIsResending(true);
    setResent(false);
    setError(null);

    const pendingToken = sessionStorage.getItem("otpPendingToken");
    if (!pendingToken) {
      setError("Session expired. Please sign up again.");
      setIsResending(false);
      return;
    }

    // Decode the pending token to get signup data and send a new OTP
    const res = await fetch("/api/auth/send-otp/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingToken }),
    });

    const body = await res.json().catch(() => ({}));
    setIsResending(false);

    if (!res.ok) {
      setError(body.error ?? "Failed to resend code. Please try again.");
    } else {
      sessionStorage.setItem("otpPendingToken", body.pendingToken);
      setResent(true);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const token = otp.join("");

  return (
    <div className="w-full">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Check your email</h1>
        <p className="mt-2 text-sm text-gray-500">
          We sent a 6-digit verification code to
        </p>
        <p className="mt-1 text-sm font-semibold text-blue-600 truncate">{email}</p>
      </div>

      {/* Resent confirmation */}
      {resent && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
          A new code has been sent to your email.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6-digit OTP boxes */}
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-14 w-12 rounded-xl border-2 text-center text-xl font-bold transition-all outline-none select-none ${
                digit
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-900"
              } focus:border-orange-500 focus:bg-orange-50 focus:ring-2 focus:ring-orange-100`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 font-medium">{error}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold disabled:opacity-50"
          disabled={isLoading || token.length < 6}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Email
        </Button>
      </form>

      {/* Resend + back */}
      <div className="mt-6 text-center space-y-3">
        <p className="text-sm text-gray-400">
          Didn&apos;t receive the code?
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
        >
          {isResending
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <RotateCcw className="h-3.5 w-3.5" />
          }
          {isResending ? "Sending..." : "Resend code"}
        </button>
        <div className="pt-1">
          <Link
            href="/signup"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
