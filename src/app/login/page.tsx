"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2Icon, AlertCircleIcon } from "lucide-react";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-bg-light via-white to-primary/5 px-4">
      {/* Floating brand orbs */}
      <div className="pointer-events-none absolute -top-32 -start-32 size-96 rounded-full bg-primary/20 blur-3xl animate-float-slow" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -end-32 size-96 rounded-full bg-teal/15 blur-3xl animate-float-slow-reverse" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 end-1/4 size-64 rounded-full bg-coral/10 blur-3xl animate-float-slow" aria-hidden="true" style={{ animationDelay: '-6s' }} />

      <div className="relative w-full max-w-sm animate-page-in">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Insight Marketing"
            width={160}
            height={52}
            priority
            className="mix-blend-multiply"
          />
        </div>

        <Card className="border-white/60 bg-white/70 shadow-xl backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t.dashboard.title}</CardTitle>
            <CardDescription>Sign in to manage submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircleIcon className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={loading} size="lg" className="mt-2 w-full">
                {loading ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    {t.common.loading}
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
