# Upgrade: Next.js 14.2.5 → 16.1.1 (App Router)

This PR upgrades the project to Next.js 16.1.1 and applies necessary config + code fixes to keep features functioning.

## Summary of changes

- Bumped packages:
  - `next` → **16.1.1**
  - `eslint-config-next` → **16.1.1**
  - `contentlayer2` → **0.5.8**
  - `next-contentlayer2` → **0.5.8**
  - `eslint` → **9.39.2**
  - `@typescript-eslint/*` → compatible versions
  - Minor devDependencies updates (prettier, tailwind plugins, etc.)

- Config changes:
  - `next.config.js` migrated to **ESM** `next.config.mjs`
    - Replaced `experimental.serverComponentsExternalPackages` with `serverExternalPackages`
    - Added explicit empty `turbopack: {}` to avoid Turbopack detection error
  - `tsconfig.json` adjustments (Next 16 reconfiguration; `jsx` set to `react-jsx` by Next tool)

- Auth & runtime fixes:
  - Removed references to deleted `auth` helper and replaced with Supabase `getCurrentUser` (`lib/session.ts`) in server actions (`actions/update-user-name`, `actions/update-user-role`) and API route (`app/api/user/route.ts`).
  - Set `export const runtime = "nodejs"` for API routes using Node-only libs (Supabase/Prisma)
  - Updated server helpers to `await cookies()` where Next 16 returns a Promise

- Type fixes for Next 16:
  - Aligned API handler signatures to use `NextRequest` and awaited `context.params` (dynamic routes)

## Build results

- `pnpm install` and `pnpm run build` complete successfully on my local (Next.js 16.1.1, Turbopack). See build log in PR comments.

## Remaining warnings (non-blocking)

- `middleware` file convention is deprecated — recommend migrating to `proxy` in a follow-up.
- Contentlayer warns about Windows usage (expected); CI on Linux/Mac should be fine.

## QA checklist (manual testing done / to run)

- [x] dev server starts (`pnpm dev`)
- [x] Production build succeeds (`pnpm run build`)
- [x] Supabase auth flows: sign-in page loads; auth proxy route handles requests
- [x] API routes that read/set cookies respond (e.g., `/api/auth`, `/api/user`)
- [x] Contentlayer-powered pages render (e.g., `/blog`, `/guides/[slug]`)
- [x] Email preview runs (`pnpm run email`)

## Notes for reviewers

- The PR intentionally keeps Node-only logic on Node runtime; avoid migrating Prisma or bcryptjs to Edge.
- If CI shows additional type or platform-specific issues, I can follow up with targeted fixes.

---

If you want, I can (in a follow-up):
- Migrate `middleware` → `proxy` (small change, needs verification),
- Resolve Contentlayer Windows warnings (or add CI step to ensure cross-environment compatibility),
- Tidy up devDependencies and address Prisma version mismatch warnings.

CC: @mickasmt — please review and merge when satisfied.