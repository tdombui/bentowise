// /app/login/page.tsx
'use client';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const signInWithProvider = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <button onClick={() => signInWithProvider('google')} className="bg-red-600 text-white p-2 rounded">
        Sign in with Google
      </button>
      <button onClick={() => signInWithProvider('github')} className="bg-gray-800 text-white p-2 rounded">
        Sign in with GitHub
      </button>
    </div>
  );
}
