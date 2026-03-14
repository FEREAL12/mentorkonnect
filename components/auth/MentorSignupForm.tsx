"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Camera,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  User,
  Briefcase,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/constants/countries";

// ─── Password rules ───────────────────────────────────────────────────────────

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number (0–9)", test: (p: string) => /\d/.test(p) },
  { label: "One special character (!@#$…)", test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
];

const mentorSignupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    phone: z
      .string()
      .min(7, "Phone number is too short")
      .regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid phone number with country code (e.g. +2348012345678)"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/\d/, "Must include a number")
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, "Must include a special character"),
    confirmPassword: z.string(),
    profession: z.string().min(2, "Profession is required"),
    country: z.string().min(1, "Please select your country"),
    yearsOfExperience: z.coerce
      .number({ invalid_type_error: "Enter a number" })
      .int()
      .min(0, "Cannot be negative")
      .max(60, "Enter a realistic value"),
    mentoringStyle: z.enum(["VIRTUAL", "HYBRID"], { required_error: "Select a mentoring style" }),
    hourlyRate: z.coerce
      .number({ invalid_type_error: "Enter a valid amount" })
      .min(0, "Rate cannot be negative")
      .max(10000, "Enter a realistic rate"),
    trainingTime: z.array(z.string()).min(1, "Select at least one training time"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type MentorSignupData = z.infer<typeof mentorSignupSchema>;

const TRAINING_TIMES = [
  { value: "Morning", label: "Morning", sub: "6 AM – 12 PM", emoji: "🌅" },
  { value: "Afternoon", label: "Afternoon", sub: "12 PM – 6 PM", emoji: "☀️" },
  { value: "Evening", label: "Evening", sub: "6 PM – 10 PM", emoji: "🌆" },
  { value: "Weekends", label: "Weekends", sub: "Sat & Sun", emoji: "🎉" },
];

const TRAINING_TIME_SLOTS: Record<string, string[]> = {
  Morning:   ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  Afternoon: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  Evening:   ["18:00", "19:00", "20:00", "21:00"],
};

function buildAvailability(trainingTimes: string[]): Record<string, string[]> {
  const timePeriods = trainingTimes.filter((t) => t !== "Weekends");
  const includesWeekends = trainingTimes.includes("Weekends");
  const slots = timePeriods.flatMap((t) => TRAINING_TIME_SLOTS[t] ?? []);
  const availability: Record<string, string[]> = {};
  if (slots.length > 0) {
    for (const day of ["mon", "tue", "wed", "thu", "fri"]) {
      availability[day] = slots;
    }
  }
  if (includesWeekends) {
    const weekendSlots = slots.length > 0 ? slots : ["10:00", "11:00", "14:00", "15:00"];
    availability["sat"] = weekendSlots;
    availability["sun"] = weekendSlots;
  }
  return availability;
}

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Account", icon: User },
  { id: 2, label: "Professional", icon: Briefcase },
  { id: 3, label: "Availability", icon: Clock },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarPicker({
  preview,
  onFileSelect,
  error,
}: {
  preview: string | null;
  onFileSelect: (file: File) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group focus:outline-none"
      >
        <Avatar className="h-24 w-24 ring-4 ring-orange-100 group-hover:ring-orange-300 transition-all shadow-lg">
          <AvatarImage src={preview ?? undefined} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-orange-100 text-blue-600 text-2xl font-bold">
            {preview ? "" : "?"}
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-6 w-6 text-white" />
        </span>
        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center shadow">
          <Camera className="h-3.5 w-3.5 text-white" />
        </div>
      </button>
      <p className="text-xs text-gray-500">
        Click to upload photo <span className="text-orange-500 font-semibold">*</span>
      </p>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
      }} />
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {PASSWORD_RULES.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passed ? colors[passed - 1] : "bg-gray-100"}`} />
          ))}
        </div>
        <span className={`text-xs font-semibold ${passed >= 4 ? "text-green-500" : passed >= 2 ? "text-orange-500" : "text-red-500"}`}>
          {labels[passed - 1] ?? ""}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-gray-400"}`}>
              {ok ? <CheckCircle2 className="h-3 w-3 shrink-0 text-green-500" /> : <Circle className="h-3 w-3 shrink-0" />}
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function MentorSignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<MentorSignupData>({
    resolver: zodResolver(mentorSignupSchema),
    defaultValues: { trainingTime: [] },
  });

  const passwordValue = watch("password") ?? "";

  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 5 MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarError(null);
  };

  const toggleTime = (value: string) => {
    const updated = selectedTimes.includes(value)
      ? selectedTimes.filter((t) => t !== value)
      : [...selectedTimes, value];
    setSelectedTimes(updated);
    setValue("trainingTime", updated, { shouldValidate: true });
  };

  const goNext = async () => {
    const step1Fields = ["fullName", "email", "phone", "password", "confirmPassword"] as const;
    const step2Fields = ["profession", "country", "yearsOfExperience", "mentoringStyle", "hourlyRate"] as const;
    const fields = currentStep === 1 ? step1Fields : step2Fields;
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => s + 1);
  };

  const onSubmit = async (data: MentorSignupData) => {
    if (!avatarFile) {
      setAvatarError("Please upload a profile picture");
      return;
    }
    setIsLoading(true);
    setError(null);

    // 1. Upload avatar using a temporary ID (replaced after OTP verification)
    let avatarUrl: string | null = null;
    const tempId = crypto.randomUUID();
    const fd = new FormData();
    fd.append("file", avatarFile);
    fd.append("userId", tempId);
    const uploadRes = await fetch("/api/storage/upload-avatar", { method: "POST", body: fd });
    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      avatarUrl = uploadData.publicUrl ?? null;
    } else {
      const uploadBody = await uploadRes.json().catch(() => ({}));
      setError(`Profile photo upload failed: ${uploadBody.error ?? "unknown error"}.`);
      setIsLoading(false);
      return;
    }

    // 2. Send OTP via Resend (custom flow — bypasses Supabase email limits)
    const mentorData = {
      displayName: data.fullName,
      title: data.profession,
      bio: `Mentor with ${data.yearsOfExperience} years of experience in ${data.profession}.`,
      country: data.country,
      yearsOfExperience: data.yearsOfExperience,
      mentoringFormat: data.mentoringStyle,
      hourlyRate: data.hourlyRate,
      preferredAvailabilityTime: data.trainingTime.join(","),
      avatarUrl,
      availability: buildAvailability(data.trainingTime),
    };

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password, role: "MENTOR", mentorData }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Failed to send verification email. Please try again.");
      setIsLoading(false);
      return;
    }

    // 3. Store pending token for the verify page
    sessionStorage.setItem("otpPendingToken", json.pendingToken);

    // 4. Redirect to email OTP verification
    window.location.href = `/verify?email=${encodeURIComponent(data.email)}&type=mentor`;
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((step, i) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : isCurrent
                    ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "border-gray-200 bg-white text-gray-400"
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-4.5 w-4.5" />}
                </div>
                <span className={`text-xs font-semibold ${isCurrent ? "text-orange-500" : isCompleted ? "text-green-500" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-16 mx-2 mb-5 transition-all duration-300 ${currentStep > step.id ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Step 1: Account Details ── */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-500 mt-1">Start with your personal details</p>
            </div>

            {/* Avatar */}
            <div className="flex justify-center">
              <AvatarPicker preview={avatarPreview} onFileSelect={handleFileSelect} error={avatarError ?? undefined} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="fullName">Full Name <span className="text-orange-500">*</span></Label>
                <Input id="fullName" placeholder="Jane Smith" {...register("fullName")} className="h-11" />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="email">Email Address <span className="text-orange-500">*</span></Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className="h-11" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="phone">Phone Number <span className="text-orange-500">*</span></Label>
                <Input id="phone" type="tel" placeholder="+2348012345678" {...register("phone")} className="h-11" />
                <p className="text-xs text-gray-400">Include country code — an OTP will be sent to this number</p>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password <span className="text-orange-500">*</span></Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" className="h-11 pr-10" {...register("password")} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                <PasswordStrength password={passwordValue} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-orange-500">*</span></Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Repeat your password" className="h-11 pr-10" {...register("confirmPassword")} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button type="button" onClick={goNext} size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 h-12 font-semibold">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Professional Details ── */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Professional details</h2>
              <p className="text-sm text-gray-500 mt-1">Tell mentees about your expertise</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="profession">Profession <span className="text-orange-500">*</span></Label>
                <Input id="profession" placeholder="e.g. Software Engineer" {...register("profession")} className="h-11" />
                {errors.profession && <p className="text-xs text-red-500">{errors.profession.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Country <span className="text-orange-500">*</span></Label>
                <Select onValueChange={(val) => setValue("country", val, { shouldValidate: true })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="yearsOfExperience">Years of Experience <span className="text-orange-500">*</span></Label>
                <Input id="yearsOfExperience" type="number" min={0} max={60} placeholder="e.g. 5" {...register("yearsOfExperience")} className="h-11" />
                {errors.yearsOfExperience && <p className="text-xs text-red-500">{errors.yearsOfExperience.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Mentoring Style <span className="text-orange-500">*</span></Label>
                <Select onValueChange={(val) => setValue("mentoringStyle", val as "VIRTUAL" | "HYBRID", { shouldValidate: true })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIRTUAL">💻 Virtual (online only)</SelectItem>
                    <SelectItem value="HYBRID">🤝 Hybrid (online + in-person)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.mentoringStyle && <p className="text-xs text-red-500">{errors.mentoringStyle.message}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="hourlyRate">Session Rate (USD / hour) <span className="text-orange-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                  <Input id="hourlyRate" type="number" min={0} step={5} placeholder="e.g. 50" className="pl-8 h-11" {...register("hourlyRate")} />
                </div>
                {errors.hourlyRate && <p className="text-xs text-red-500">{errors.hourlyRate.message}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={() => setCurrentStep(1)} size="lg" variant="outline" className="flex-1 h-12 font-semibold">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="button" onClick={goNext} size="lg" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white border-0 h-12 font-semibold">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Availability ── */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Set your availability</h2>
              <p className="text-sm text-gray-500 mt-1">When are you generally free to mentor?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {TRAINING_TIMES.map((t) => {
                const active = selectedTimes.includes(t.value);
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => toggleTime(t.value)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all duration-200 ${
                      active
                        ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                        : "border-gray-200 hover:border-orange-200 hover:bg-orange-50/50"
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className={`font-bold text-sm ${active ? "text-orange-600" : "text-gray-700"}`}>{t.label}</span>
                    <span className="text-xs text-gray-400">{t.sub}</span>
                    {active && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.trainingTime && (
              <p className="text-center text-xs text-red-500 font-medium">{errors.trainingTime.message}</p>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" onClick={() => setCurrentStep(2)} size="lg" variant="outline" className="flex-1 h-12 font-semibold">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 h-12 font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating account...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Create Mentor Account</>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login/mentor" className="font-semibold text-blue-600 hover:underline">
          Sign in
        </Link>
        {" · "}
        <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
          Sign up as a mentee
        </Link>
      </p>
    </div>
  );
}
