/**
 * Middleware removed — migration to Proxy system
 *
 * This project previously used a Next.js `middleware.ts` file to run on every
 * request. Since Next.js 16 the middleware convention is deprecated. There
 * was no request rewrites/redirects performed here, and auth/session handling
 * is done in server components and route handlers (see `lib/session.ts` and
 * `lib/supabase/proxy.ts`).
 *
 * To avoid the deprecation warning and preserve identical runtime behavior,
 * this file has been intentionally left empty (no exported `middleware`).
 *
 * If you need to run per-request logic previously done in middleware (e.g.,
 * cookie sync with Supabase), implement a Proxy route and call
 * `lib/supabase/proxy.ts::updateSession` from it. See README or the PR notes
 * for how to add a proxy route without changing auth behavior.
 */

// NOTE: Intentionally no exports. The presence of an exported `middleware`
// function is what triggers the Next.js middleware behavior and related
// deprecation warnings; leaving this file as a comment preserves history
// while eliminating runtime middleware functionality.

