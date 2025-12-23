# GitHub Copilot / AI Agent Instructions

Short, targeted orientation for working in this repository so an AI agent can be immediately productive.

## Quick overview
- Tech: Next.js (app router, RSC), TypeScript, Prisma (Postgres/Neon), Auth.js (NextAuth v5), Stripe, Resend + React Email, Tailwind, Shadcn UI.
- Core folders: `app/` (routes + API), `components/` (UI by feature), `actions/` (server actions), `lib/` (db, stripe, helpers), `prisma/` (schema + migrations), `emails/` (React Email templates).

## Essential commands
- Install & generate: `pnpm install` (runs `prisma generate` via postinstall)
- Dev server: `pnpm run dev`
- Build: `pnpm run build` then `pnpm run start` or `pnpm run preview`
- Lint: `pnpm run lint`
- Email templates preview: `pnpm run email` (serves `emails/` on port 3333)
- Prisma migrations: `npx prisma migrate dev`; quick sync: `npx prisma db push`
- Stripe webhooks (local): `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`

## Environment
- Copy `.env.example` → `.env.local` and populate secrets.
- `env.mjs` validates environment variables with Zod and will fail fast if keys are missing. Check it first when debugging startup errors.

## Architecture & developer patterns (what matters)
- App router with route groups: protected server pages live under `app/(protected)/`. Middleware and auth gating are wired via `middleware.ts` and `auth.ts`.
- Authentication: NextAuth configured in `auth.ts` plus `auth.config.ts`. Type augmentation for sessions/users is centralized in `types/next-auth.d.ts` — avoid duplicating or contradicting those declarations in other files.
- DB: `lib/db.ts` exports a globally cached Prisma client. Prisma models live in `prisma/schema.prisma` and migrations in `prisma/migrations/`.
- Server actions: long-running or side-effecting backend work is implemented as server actions in `actions/` (called from client components via `startTransition`). See `components/forms/billing-form-button.tsx` for an example.
- Stripe: `lib/stripe.ts` is the client; checkout/portal helpers live in `actions/`; webhook handler is `app/api/webhooks/stripe/route.ts` and MUST verify signatures with `STRIPE_WEBHOOK_SECRET`.
- Emails: React Email templates are in `emails/` and are previewed with `pnpm run email`; sending uses Resend in `lib/email.ts`.

## Type & module-augmentation guidance (practical rules)
- Centralize NextAuth type extensions in `types/next-auth.d.ts`. Do not redefine `Session` or `User` properties elsewhere — duplicated augmentations can produce type conflicts (e.g., `emailVerified` mismatch).
- If you need to add runtime-only fields to JWT/session objects, prefer adding them to the JWT in `callbacks.jwt` and map them in `callbacks.session` while preserving the expected types (e.g., `User.emailVerified` is `Date | null` by default).

Concrete example from the repo:
- Type declarations: [types/next-auth.d.ts](types/next-auth.d.ts#L1)
- Auth handler: [auth.ts](auth.ts#L1)

When editing `auth.ts`, follow the pattern: read DB `User.emailVerified` (Date|null) from Prisma and propagate that same shape through the JWT/session mapping instead of coercing to boolean; adjust the session shape only via the single source of truth in `types/next-auth.d.ts`.

## Integrations & external dependencies to watch
- Stripe: `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` — webhooks must be verified.
- Resend: email sending configured via env keys validated in `env.mjs`.
- NextAuth: uses Prisma adapter (`@auth/prisma-adapter`) and expects the Prisma `User` model in `prisma/schema.prisma`.

## Common pitfalls & debugging tips
- Missing env vars: `env.mjs` will throw — check `.env.local` early.
- Type conflicts: check `types/` for augmentations before adding new `declare module` blocks.
- Webhooks: use `stripe listen` locally and forward to `app/api/webhooks/stripe/route.ts` for end-to-end testing.

## How an AI agent should behave
- Make small, focused edits; preserve existing conventions (server actions, server components, `env.mjs` validation).
- When changing DB shape, include Prisma migration steps and run `npx prisma generate`.
- Provide explicit run/test steps for the user and reference file locations for every change.

If you'd like, I can expand any section with more examples (e.g., add a sample server action, a minimal test harness, or a walkthrough for adding a Stripe plan). Please tell me which area to expand.
