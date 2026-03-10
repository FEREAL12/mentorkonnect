import type {
  User,
  MentorProfile,
  MenteeProfile,
  Skill,
  Match,
  Session,
  Message,
  Programme,
  Role,
  MatchStatus,
  SessionStatus,
} from "@prisma/client";

// Re-export Prisma enums
export { Role, MatchStatus, SessionStatus };

// ─── Extended types with relations ───────────────────────────────────────────

export type MentorWithProfile = User & {
  mentorProfile:
    | (MentorProfile & {
        skills: Array<{ skill: Skill }>;
      })
    | null;
};

export type MentorProfileWithSkills = MentorProfile & {
  skills: Array<{ skill: Skill }>;
  user: User;
};

export type MatchWithDetails = Match & {
  mentor: MentorProfile & { user: User; skills: Array<{ skill: Skill }> };
  mentee: MenteeProfile & { user: User };
  sessions: Session[];
  messages: Message[];
};

export type SessionWithDetails = Session & {
  match: Match;
  mentor: User;
  mentee: User;
  programme: Programme | null;
};

export type MessageWithSender = Message & {
  sender: User;
};

// ─── Form types ───────────────────────────────────────────────────────────────

export type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  role: "MENTOR" | "MENTEE";
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type MentorProfileFormData = {
  displayName: string;
  title: string;
  company?: string;
  bio: string;
  linkedinUrl?: string;
  skills: string[]; // skill IDs
  availability: Record<string, string[]>; // { mon: ["09:00", "10:00"], ... }
};

export type MenteeProfileFormData = {
  displayName: string;
  goals: string;
  background?: string;
};

export type BookSessionFormData = {
  scheduledAt: Date;
  durationMins: number;
  notes?: string;
  meetingUrl?: string;
  programmeId?: string;
};

// ─── API response types ───────────────────────────────────────────────────────

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ─── Dashboard stat types ─────────────────────────────────────────────────────

export type DashboardStats = {
  totalUsers?: number;
  totalMentors?: number;
  totalMentees?: number;
  pendingVerifications?: number;
  activeMatches?: number;
  totalSessions?: number;
  upcomingSessions?: number;
  pendingMatchRequests?: number;
};

// ─── Availability ─────────────────────────────────────────────────────────────

export type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Availability = Record<WeekDay, string[]>;

export const WEEK_DAYS: { key: WeekDay; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00",
];
