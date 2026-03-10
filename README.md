# MentorKonnect

A full-stack mentorship platform built with **Next.js 14 (App Router)**, **Supabase** (Auth + PostgreSQL + Realtime), **Prisma**, **Tailwind CSS**, and **shadcn/ui**.

---

## Features

- **Role-based users** — Admin, Mentor, Mentee
- **Mentor directory & search** — Browse and filter mentors by skill
- **Mentor-Mentee matching** — Request and accept connection
- **Session booking** — Schedule 1:1 sessions with availability slots
- **Real-time messaging** — Chat powered by Supabase Realtime
- **Structured programmes** — Curated mentorship programmes
- **Admin panel** — User management, mentor verification

---

## Getting Started

### 1. Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [A Supabase project](https://supabase.com/)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env .env.local
```

Fill in your Supabase credentials in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-region.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Push the database schema

```bash
npm run db:generate
npm run db:push
```

### 5. Enable Supabase Realtime

In your Supabase dashboard, go to **Database → Replication** and enable the `messages` table for Realtime.

### 6. Seed initial data (skills + programmes)

```bash
npm run db:seed
```

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
mentorkonnect/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, Signup pages (no sidebar)
│   ├── (dashboard)/        # Protected pages with sidebar
│   │   ├── dashboard/      # Role-aware home
│   │   ├── mentors/        # Browse + mentor profile
│   │   ├── sessions/       # Sessions list + booking
│   │   ├── messages/       # Inbox + chat
│   │   ├── programmes/     # Programme catalogue
│   │   ├── profile/        # Setup + edit
│   │   └── admin/          # Admin panel
│   └── api/                # API routes
├── components/             # UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Supabase clients, Prisma, utils
├── prisma/                 # Schema + seed
└── types/                  # Shared TypeScript types
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Auth + DB | Supabase |
| ORM | Prisma |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Realtime | Supabase Realtime (PostgreSQL changes) |

---

## Supabase RLS Policies

After pushing the schema, add these Row Level Security policies in your Supabase SQL editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users: read own row
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Mentor profiles: public read
CREATE POLICY "Mentor profiles are public" ON mentor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Mentors can update own profile" ON mentor_profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Messages: only match participants
CREATE POLICY "Match participants can read messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m
      JOIN mentor_profiles mp ON mp.id = m.mentor_id
      JOIN mentee_profiles mep ON mep.id = m.mentee_id
      WHERE m.id = messages.match_id
        AND (mp.user_id = auth.uid()::text OR mep.user_id = auth.uid()::text)
    )
  );

CREATE POLICY "Match participants can insert messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id);
```

---

## Creating an Admin User

1. Sign up with an email/password as usual (select any role)
2. In your Supabase dashboard → Authentication → Users, find the user
3. Update their `raw_user_meta_data` to `{"role": "ADMIN"}`
4. In your database, update the `users` table: `UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema to Supabase |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed skills and programmes |
