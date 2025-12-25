/* Removed: NextAuth handler no longer used.
   This project uses Supabase for authentication. If you accidentally import
   this file, please switch to Supabase utilities in `lib/auth-adapter.tsx`.
*/

export const GET = () => {
  throw new Error("NextAuth has been removed. Use Supabase auth endpoints instead.");
};
export const POST = GET;

