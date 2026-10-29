# AssignFlow — Academic Assignment Management System

A modern, responsive, full-stack Assignment Management System designed specifically for college and university students to organize coursework, track strict deadlines, prioritize academic deliverables, and boost semester performance.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth + Row Level Security)**.

---

## 🚀 Key Features

- **Academic Dashboard**: Instant visual breakdown of Total, Pending, In Progress, Completed, and Overdue assignments with real-time percentage completion metrics.
- **Strict Overdue Tracking**: Real-time date computation identifying missed deadlines with visual alert badges. Consistent rules ensure completed tasks are never marked overdue.
- **Complete Assignment CRUD**:
  - Create assignments with title, course/subject, deadline, priority (`Low`, `Medium`, `High`), status (`Pending`, `In Progress`, `Completed`), and notes.
  - View detailed assignment cards and dedicated single-assignment overview pages.
  - Edit all assignment attributes with pre-populated forms and validation.
  - Delete assignments safely with an explicit confirmation dialog.
- **Search, Filtering & Sorting**:
  - Real-time search by title and subject.
  - Filter by status (`Pending`, `In Progress`, `Completed`).
  - Filter by priority (`High`, `Medium`, `Low`).
  - Dynamic course/subject filter.
  - Sort by due date (earliest or latest) or creation timestamp (newest or oldest).
  - One-click **Clear Filters** reset.
- **Supabase Authentication**:
  - Secure student sign-up, sign-in, and sign-out.
  - Persistent sessions handled via `@supabase/ssr` cookies.
  - Protected routes (`/dashboard`, `/assignments/*`, `/settings`) with middleware redirection.
- **PostgreSQL Row Level Security (RLS)**:
  - Every assignment is strictly bound to `auth.uid()`.
  - Granular `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies ensure users can never view, alter, or delete assignments belonging to other students.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS with responsive academic UI design |
| **Icons** | Lucide React |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth + `@supabase/ssr` |
| **Security** | PostgreSQL Row Level Security (RLS) |
| **Deployment** | Vercel & GitHub |

---

## 📁 Project Structure

```
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/
│   │   │   ├── actions.ts      # Server actions: login, signup, logout
│   │   │   └── callback/       # OAuth / Auth code exchange route handler
│   │   ├── assignments/
│   │   │   ├── page.tsx        # Assignment list & interactive filters
│   │   │   ├── new/            # Create assignment page
│   │   │   └── [id]/           # Details & Edit routes
│   │   ├── dashboard/          # Academic analytics dashboard
│   │   ├── login/              # Sign in page
│   │   ├── signup/             # Student registration page
│   │   ├── settings/           # Profile & Supabase connection checker
│   │   ├── globals.css         # Tailwind & theme styles
│   │   ├── layout.tsx          # Root HTML layout & metadata
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── assignments/        # Assignment card, form, list, and delete modal
│   │   ├── dashboard/          # StatCards & UpcomingDeadlines widgets
│   │   ├── layout/             # Responsive Navbar & drawer navigation
│   │   ├── ui/                 # Reusable badges, alerts, and empty states
│   │   └── common/             # Configuration alert banner
│   ├── lib/
│   │   ├── supabase/           # SSR client, server, and middleware helpers
│   │   ├── assignments.ts      # Server-side assignment queries and mutations
│   │   └── utils.ts            # Date formatting, deadline calculations, classnames
│   ├── middleware.ts           # Route protection & session refresh
│   └── types/                  # Database & application TypeScript definitions
├── supabase/
│   └── migrations/             # SQL schema migrations & RLS policies
├── .env.example                # Example environment variables template
└── .env.local                  # Local secrets (gitignored)
```

---

## ⚙️ Environment Variables

AssignFlow uses the following exact environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Retrieve your project URL and Anon / Publishable key from your [Supabase Dashboard](https://app.supabase.com) under **Project Settings > API**.
3. Paste the values into `.env.local`.

> ⚠️ **Security Notice:** `.env.local` is ignored in `.gitignore` and must never be committed to version control. Never expose the `service_role` secret in client-side code.

---

## 🗄️ Database Setup & RLS Migration

1. In your [Supabase Dashboard](https://app.supabase.com), navigate to the **SQL Editor**.
2. Open the migration file [`supabase/migrations/20261029000000_create_assignments_table.sql`](./supabase/migrations/20261029000000_create_assignments_table.sql).
3. Paste and run the SQL query. It creates:
   - The `public.assignments` table.
   - Indices on `user_id`, `status`, `priority`, `due_date`, and `subject`.
   - Automated `updated_at` trigger.
   - Enabled Row Level Security (RLS) with 4 explicit policies:
     - `Users can read own assignments` (`SELECT`)
     - `Users can insert own assignments` (`INSERT`)
     - `Users can update own assignments` (`UPDATE` with ownership lock)
     - `Users can delete own assignments` (`DELETE`)

---

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run TypeScript Check**:
   ```bash
   npx tsc --noEmit
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Vercel Deployment Guide

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AssignFlow Assignment Management System"
   git remote add origin https://github.com/<your-username>/assignflow.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
   - Import your GitHub repository.
   - In the **Environment Variables** section, add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase Anon key
   - Click **Deploy**.

3. **Supabase Auth Redirect Configuration**:
   - In the Supabase Dashboard, go to **Authentication > URL Configuration**.
   - Set **Site URL** to your Vercel deployment URL (e.g., `https://assignflow.vercel.app`).
   - Add to **Redirect URLs**:
     - `http://localhost:3000/auth/callback`
     - `https://assignflow.vercel.app/auth/callback`
     - `https://*.vercel.app/auth/callback` (for preview deployments)

---

## ✅ Production Verification Checklist

- [x] Next.js 14 App Router with TypeScript strictly typed (zero `tsc` errors).
- [x] Tailwind CSS responsive UI tested across mobile, tablet, and desktop breakpoints.
- [x] Real PostgreSQL database schema with UUID primary keys and cascading foreign keys.
- [x] Row Level Security (RLS) enabled with ownership isolation via `auth.uid()`.
- [x] `@supabase/ssr` server actions and middleware route protection.
- [x] Dynamic dashboard metrics computed from live database records.
- [x] Assignment CRUD functionality (Create, Read, Update, Delete with confirmation).
- [x] Interactive Search, Status/Priority/Subject Filtering, and Multi-way Sorting.
- [x] Production build passes cleanly with static and dynamic App Router routes.

