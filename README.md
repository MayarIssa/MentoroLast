# Mentoro

**Live:** [mentoro2.vercel.app](https://mentoro2.vercel.app/)

Mentoro is a mentorship platform that connects students with mentors who guide them through a learning roadmap. It was our graduation project at Pharos University (Faculty of Computer Science and Artificial Intelligence, 2025), built by a team of six: two frontend, two backend and two mobile developers.

## What it does

- **Three dashboards** for three roles: students, mentors and admins.
- **Students** find a mentor, follow a personalised roadmap, track tasks and progress, and chat with their mentor.
- **Mentors** review student requests, plan roadmaps, assign tasks and share resources.
- **Admins** approve new mentors and handle payment requests and complaints.
- **Real-time chat** between students and mentors (SignalR).
- **AI assistant** that answers students' questions inside the app.
- **Arabic and English**, with full right-to-left layout for Arabic (next-intl).
- Authentication with NextAuth, plus password reset.

## My part

I designed the complete interface in Figma, then built the home page, user profiles and the mentor–mentee connections feature in the web app.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Radix UI · TanStack Query · NextAuth · next-intl · SignalR · Vercel AI SDK · Framer Motion

The backend (ASP.NET) and the mobile app were built by teammates in separate repositories.

## Run it locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.
