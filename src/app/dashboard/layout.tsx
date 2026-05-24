"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon, FileTextIcon, UsersIcon, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function DashboardSidebar() {
  const { t } = useI18n();
  const { signOut } = useAuth();
  const pathname = usePathname();

  const navItems = [
    {
      label: t.dashboard.submissions,
      href: "/dashboard",
      icon: FileTextIcon,
      match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/submissions"),
    },
    {
      label: t.dashboard.clients,
      href: "/dashboard/clients",
      icon: UsersIcon,
      match: (p: string) => p.startsWith("/dashboard/clients"),
    },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-border bg-background">
      {/* Logo */}
      <div className="flex items-center border-b border-border px-4 py-4">
        <Image
          src="/logo.png"
          alt="Insight Marketing"
          width={120}
          height={40}
          priority
          className="mix-blend-multiply"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border px-3 py-4">
        <div className="mb-3 flex justify-center">
          <LanguageToggle />
        </div>
        <Separator className="mb-3" />
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOutIcon className="size-4" />
          {t.dashboard.logout}
        </Button>
      </div>
    </aside>
  );
}

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto bg-muted/40 p-6">{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardGuard>{children}</DashboardGuard>
    </AuthProvider>
  );
}
