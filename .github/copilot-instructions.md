# GitHub Copilot / AI Agent Instructions

Short, targeted orientation for working in this repository so an AI agent can be immediately productive.

## Repo at-a-glance ✅
- Tech: Next.js 14 (app dir RSC), TypeScript, Prisma (Postgres/Neon), Auth.js (NextAuth v5), Stripe, Resend + React Email, Tailwind, Shadcn UI.
- Top-level layout: app/ (routes & API), components/ (UI grouped by feature), lib/ (db, stripe, subscription helpers), actions/ (server actions), prisma/ (schema + migrations), emails/ (React Email templates), content/ (docs + contentlayer).

## Key commands (run locally) ▶️
- Install: `pnpm install` (runs `prisma generate` via postinstall)
- Dev: `pnpm run dev`
- Build: `pnpm run build` and `pnpm run start` or `pnpm run preview`
- Lint: `pnpm run lint`
- Email templates dev server: `pnpm run email` (serves `emails/` on port 3333)
- Prisma: `npx prisma db push` or `npx prisma migrate dev` (see `prisma/` + migrations)
- Stripe webhook local testing: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`

## Environment & secrets 🔒
- Copy `.env.example` -> `.env.local` and populate required values.
- `env.mjs` validates env with Zod; missing values will fail fast — check `env.mjs` for required keys (Auth, DATABASE_URL, STRIPE, RESEND variables).
- Important env vars: `AUTH_SECRET`, `DATABASE_URL`, `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_*` Stripe plan IDs.

## Major architecture & patterns 🏗️
- App router (app/) with route groups: `(protected)` contains authenticated server pages; middleware is wired via `middleware.ts` -> `auth.ts` (NextAuth handlers exported there).
- Authentication: `auth.ts` + `auth.config.ts` use Prisma adapter and augment NextAuth session/user types (see `types/` for type declarations).
- DB: `lib/db.ts` exports a globally cached Prisma client (common Node dev pattern).
- Stripe: `lib/stripe.ts` exports Stripe client; server endpoints and actions that touch Stripe:
  - Checkout / portal creation: `actions/generate-user-stripe.ts`, `actions/open-customer-portal.ts`
  - Webhook processing: `app/api/webhooks/stripe/route.ts` (verifies signature via `stripe.webhooks.constructEvent` and updates `User` records)
  - Pricing mapping: `config/subscriptions.ts` maps plans to `NEXT_PUBLIC_*` IDs.
- Server actions & client usage: `actions/` contains server actions. Client components call them via `startTransition` (see `components/forms/billing-form-button.tsx`).
- Email: Resend + React Email templates live in `emails/`; use `pnpm run email` to preview and `resend` server-side calls where applicable.

## Conventions & tips for code changes ✍️
- Prefer server components for server-side logic (no `"use client"` unless necessary); client components include `"use client"` header.
- Keep side-effects (DB, Stripe) in server actions or API routes; avoid doing them in client-only components.
- When changing database shape: add a Prisma migration in `prisma/migrations` and run `npx prisma migrate dev` (or `db push` for quick iteration).
- Commit rules / tooling: Husky + pretty-quick (pre-commit) and commitlint (commit-msg). Follow existing commit message conventions.

## Debugging gotchas & tests 🐞
- Stripe webhooks must be verified with `STRIPE_WEBHOOK_SECRET`. Use Stripe CLI (`stripe listen`) to forward live webhook events locally.
- `env.mjs` throws early for missing env vars — set `.env.local` before starting dev server.
- Prisma client generation happens automatically on install; regenerate with `npx prisma generate` if edits to the client or schema occur.
- There are no unit tests in the repo by default — rely on manual verification and live Stripe / email sandbox flows.

## Files to check for common tasks (quick links) 🔗
- Auth: `auth.ts`, `auth.config.ts`, `types/next-auth.d.ts`
- DB: `lib/db.ts`, `prisma/schema.prisma`, `prisma/migrations/`
- Stripe: `lib/stripe.ts`, `actions/*stripe*.ts`, `app/api/webhooks/stripe/route.ts`
- Emails: `emails/` + `package.json` script `email`
- Pricing & subscription rules: `config/subscriptions.ts`, `lib/subscription.ts`
- App routes & protected area: `app/(protected)/` and `middleware.ts`

## How an AI agent should behave here 🤖
- Make minimal, scoped changes: update code + tests (when applicable) and include clear PR descriptions and migration steps (`prisma migrate dev` etc.).
- When proposing infra or secret changes (Stripe keys, webhooks), write explicit setup steps and example commands.
- Preserve existing conventions: server actions for backend work, `env.mjs` validation for env vars, and the project’s layout pattern.

---
If anything here is unclear or you want more examples (e.g., a short walkthrough: add a Stripe event or a new server action), say which topic and I’ll update/expand this file. 👋
