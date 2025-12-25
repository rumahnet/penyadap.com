# Migrating `middleware.ts` → Proxy (Next.js 16)

This project removed the old `middleware.ts` file since it was a no-op (returned `NextResponse.next()` only).

If you need to implement per-request Edge behavior (for example to sync Supabase cookies or claims), follow these steps:

1. Create a Proxy route at `app/proxy/route.ts` with `export const runtime = "edge"`.
2. Import and call `updateSession(request)` from `@/lib/supabase/proxy` to sync Supabase cookies:

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export const runtime = 'edge';

export default async function handler(request: NextRequest) {
  await updateSession(request);
  return NextResponse.next();
}
```

Notes:
- Do **not** change authentication logic or Supabase session helpers.
- Only enable the Proxy route if you want the cookie/session sync side-effects on each matched request.
- The original middleware was a no-op, so by default removing `middleware.ts` causes no runtime changes.

See: https://nextjs.org/docs/messages/middleware-to-proxy
