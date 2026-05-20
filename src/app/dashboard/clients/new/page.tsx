"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Platform } from "@/lib/types";
import PlatformLogo from "@/components/ui/PlatformLogo";
import Toast from "@/components/ui/Toast";

const ALL_PLATFORMS: Platform[] = [
  "google",
  "facebook",
  "instagram",
  "linkedin",
  "pinterest",
];

export default function NewClientPage() {
  const router = useRouter();
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSave = async () => {
    if (!name) return;
    setSaving(true);
    const { data } = await supabase
      .from("clients")
      .insert({
        name,
        contact_email: email,
        contact_phone: phone,
        platforms,
      })
      .select("id")
      .single();
    setSaving(false);

    if (data?.id) {
      router.push(`/dashboard/clients/${data.id}`);
    } else {
      setToast(t.dashboard.clientSaved);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}

      {/* Back + Header */}
      <div className="mb-6">
        <a
          href="/dashboard/clients"
          className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <svg
            className="h-4 w-4 rtl:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t.common.back}
        </a>
        <h1 className="text-2xl font-bold text-text-primary">
          {t.dashboard.newClient}
        </h1>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-border bg-bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              {t.dashboard.clientName}
              <span className="ms-1 text-coral">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Platform selection with logos */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {t.dashboard.clientPlatforms}
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((p) => {
                const selected = platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                      selected
                        ? "border-primary/30 bg-primary/5 text-text-primary shadow-sm"
                        : "border-border bg-bg-subtle text-text-muted hover:border-border-light hover:text-text-secondary"
                    }`}
                  >
                    <PlatformLogo platform={p} size={16} />
                    {t.platforms[p]}
                    {selected && (
                      <svg
                        className="-me-0.5 h-3.5 w-3.5 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !name}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
            >
              {saving ? t.common.loading : t.common.save}
            </button>
            <a
              href="/dashboard/clients"
              className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:bg-bg-light hover:border-border-light active:scale-[0.98]"
            >
              {t.common.cancel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
