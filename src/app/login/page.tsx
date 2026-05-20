"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Insight Marketing"
            width={160}
            height={52}
            priority
          />
        </div>

        {/* Login card */}
        <div className="rounded-xl border border-border bg-bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-xl font-bold text-text-primary">
            {t.dashboard.title}
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-coral">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? t.common.loading : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
