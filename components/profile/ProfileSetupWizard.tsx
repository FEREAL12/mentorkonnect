"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Skill } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WEEK_DAYS, TIME_SLOTS } from "@/types";
import { AvatarUpload } from "./AvatarUpload";
import { COUNTRIES } from "@/lib/constants/countries";

// ─── Constants ─────────────────────────────────────────────────────────────────

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Toronto", label: "Toronto (ET)" },
  { value: "America/Vancouver", label: "Vancouver (PT)" },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
  { value: "Europe/Stockholm", label: "Stockholm (CET)" },
  { value: "Africa/Lagos", label: "Lagos (WAT)" },
  { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const AVAILABILITY_TIMES = [
  { value: "MORNING", label: "Morning (6 AM – 12 PM)" },
  { value: "AFTERNOON", label: "Afternoon (12 PM – 6 PM)" },
  { value: "EVENING", label: "Evening (6 PM – 10 PM)" },
  { value: "FLEXIBLE", label: "Flexible (any time)" },
];

const MENTORING_FORMATS = [
  { value: "VIRTUAL", label: "Virtual (online only)" },
  { value: "HYBRID", label: "Hybrid (online + in-person)" },
  { value: "IN_PERSON", label: "In-Person only" },
];

// ─── Schemas ─────────────────────────────────────────────────────────────────

const mentorSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Job title is required"),
  company: z.string().optional(),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  country: z.string().min(1, "Please select your country"),
  yearsOfExperience: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(0, "Cannot be negative")
    .max(60, "Please enter a realistic value"),
  qualification: z.string().optional(),
  timezone: z.string().optional(),
  preferredAvailabilityTime: z.string().optional(),
  mentoringFormat: z.enum(["VIRTUAL", "HYBRID", "IN_PERSON"]).optional(),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  availability: z.record(z.array(z.string())),
});

const menteeSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  goals: z.string().min(30, "Please describe your goals in at least 30 characters"),
  background: z.string().optional(),
});

type MentorFormData = z.infer<typeof mentorSchema>;
type MenteeFormData = z.infer<typeof menteeSchema>;

interface Props {
  userId: string;
  userEmail: string;
  role: string;
  skills: Skill[];
}

// ─── Mentor form ─────────────────────────────────────────────────────────────

function MentorSetupForm({ userId, userEmail, skills }: Omit<Props, "role">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MentorFormData>({
    resolver: zodResolver(mentorSchema),
    defaultValues: { skills: [], availability: {}, timezone: "UTC" },
  });

  const displayNameValue = watch("displayName");

  const toggleSkill = (skillId: string) => {
    const updated = selectedSkills.includes(skillId)
      ? selectedSkills.filter((s) => s !== skillId)
      : [...selectedSkills, skillId];
    setSelectedSkills(updated);
    setValue("skills", updated);
  };

  const toggleSlot = (day: string, slot: string) => {
    const current = availability[day] ?? [];
    const updated = current.includes(slot)
      ? current.filter((s) => s !== slot)
      : [...current, slot];
    const newAvail = { ...availability, [day]: updated };
    setAvailability(newAvail);
    setValue("availability", newAvail);
  };

  const onSubmit = async (data: MentorFormData) => {
    if (!avatarUrl) {
      setAvatarError("Please upload a profile picture");
      return;
    }
    setAvatarError(null);
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profiles/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId, email: userEmail, avatarUrl }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to save profile");
      }
      router.push("/sessions");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Profile Picture (required) ── */}
      <Card>
        <CardHeader>
          <CardTitle>
            Profile Picture <span className="text-destructive text-sm">*</span>
          </CardTitle>
          <CardDescription>Help mentees put a face to the name</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <AvatarUpload
            userId={userId}
            displayName={displayNameValue}
            onUpload={(url) => { setAvatarUrl(url); setAvatarError(null); }}
          />
          {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
        </CardContent>
      </Card>

      {/* ── Basic Information ── */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell mentees who you are</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full name *</Label>
              <Input id="displayName" placeholder="Jane Smith" {...register("displayName")} />
              {errors.displayName && (
                <p className="text-xs text-destructive">{errors.displayName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job title *</Label>
              <Input id="title" placeholder="Senior Software Engineer" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company (optional)</Label>
              <Input id="company" placeholder="Acme Corp" {...register("company")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of experience *</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min={0}
                max={60}
                placeholder="e.g. 8"
                {...register("yearsOfExperience")}
              />
              {errors.yearsOfExperience && (
                <p className="text-xs text-destructive">{errors.yearsOfExperience.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Country *</Label>
            <Select onValueChange={(val) => setValue("country", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-xs text-destructive">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification / Education (optional)</Label>
            <Input
              id="qualification"
              placeholder="e.g. BSc Computer Science, MBA, AWS Certified"
              {...register("qualification")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              placeholder="Tell mentees about your background, experience, and what you can help them with..."
              rows={4}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL (optional)</Label>
            <Input
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/yourprofile"
              {...register("linkedinUrl")}
            />
            {errors.linkedinUrl && (
              <p className="text-xs text-destructive">{errors.linkedinUrl.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Areas of Expertise / Skills ── */}
      <Card>
        <CardHeader>
          <CardTitle>Areas of Expertise *</CardTitle>
          <CardDescription>Select skills and topics you can mentor others in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  selectedSkills.includes(skill.id)
                    ? "border-primary bg-primary text-white"
                    : "border-border hover:border-primary"
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
          {errors.skills && (
            <p className="mt-2 text-xs text-destructive">{errors.skills.message}</p>
          )}
        </CardContent>
      </Card>

      {/* ── Mentoring Preferences ── */}
      <Card>
        <CardHeader>
          <CardTitle>Mentoring Preferences</CardTitle>
          <CardDescription>How and when do you prefer to mentor?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred mentoring format</Label>
            <Select
              onValueChange={(val) =>
                setValue("mentoringFormat", val as "VIRTUAL" | "HYBRID" | "IN_PERSON")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent>
                {MENTORING_FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preferred time of day</Label>
              <Select onValueChange={(val) => setValue("preferredAvailabilityTime", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a preference" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_TIMES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Your timezone</Label>
              <Select defaultValue="UTC" onValueChange={(val) => setValue("timezone", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Weekly Schedule ── */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Select specific time slots when you&apos;re available for sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {WEEK_DAYS.map(({ key, label }) => (
            <div key={key}>
              <p className="text-sm font-medium mb-2">{label}</p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(key, slot)}
                    className={`rounded border px-2 py-1 text-xs transition-colors ${
                      (availability[key] ?? []).includes(slot)
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Complete Profile
      </Button>
    </form>
  );
}

// ─── Mentee form ──────────────────────────────────────────────────────────────

function MenteeSetupForm({ userId, userEmail }: Omit<Props, "role" | "skills">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<MenteeFormData>({
    resolver: zodResolver(menteeSchema),
  });

  const onSubmit = async (data: MenteeFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profiles/mentee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId, email: userEmail }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to save profile");
      }
      router.push("/mentors");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Help mentors understand what you need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Full name *</Label>
            <Input id="displayName" placeholder="Your name" {...register("displayName")} />
            {errors.displayName && (
              <p className="text-xs text-destructive">{errors.displayName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goals">Your goals *</Label>
            <Textarea
              id="goals"
              placeholder="What do you want to achieve through mentorship? Where do you want to be in 6-12 months?"
              rows={4}
              {...register("goals")}
            />
            {errors.goals && (
              <p className="text-xs text-destructive">{errors.goals.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="background">Background (optional)</Label>
            <Textarea
              id="background"
              placeholder="Tell us about your current role, experience level, or relevant background..."
              rows={3}
              {...register("background")}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <Button type="submit" size="lg" className="w-full mt-6" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Complete Profile
      </Button>
    </form>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function ProfileSetupWizard({ userId, userEmail, role, skills }: Props) {
  return role === "MENTOR" ? (
    <MentorSetupForm userId={userId} userEmail={userEmail} skills={skills} />
  ) : (
    <MenteeSetupForm userId={userId} userEmail={userEmail} />
  );
}
