"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Client, Platform } from "@/lib/types";
import Toast from "@/components/ui/Toast";

const ALL_PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: "google", label: "Google", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "facebook", label: "Facebook", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "instagram", label: "Instagram", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { value: "linkedin", label: "LinkedIn", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { value: "pinterest", label: "Pinterest", color: "bg-red-100 text-red-700 border-red-200" },
];

export default function ClientsPage() {
  const { t } = useI18n();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    setClients((data as Client[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPlatforms([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setName(client.name);
    setEmail(client.contact_email);
    setPhone(client.contact_phone);
    setPlatforms(client.platforms || []);
    setShowForm(true);
  };

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    if (editingId) {
      await supabase
        .from("clients")
        .update({
          name,
          contact_email: email,
          contact_phone: phone,
          platforms,
        })
        .eq("id", editingId);
    } else {
      await supabase
        .from("clients")
        .insert({
          name,
          contact_email: email,
          contact_phone: phone,
          platforms,
        });
    }
    setSaving(false);
    resetForm();
    fetchClients();
    setToast(t.dashboard.clientSaved);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          {t.dashboard.clients}
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow active:scale-[0.98]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t.dashboard.newClient}
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            {editingId ? t.common.edit : t.dashboard.newClient}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                {t.dashboard.clientName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
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

            {/* Platform selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                {t.dashboard.clientPlatforms}
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_PLATFORMS.map((p) => {
                  const selected = platforms.includes(p.value);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                        selected
                          ? `${p.color} shadow-sm`
                          : "border-border bg-bg-subtle text-text-muted hover:border-border-light hover:text-text-secondary"
                      }`}
                    >
                      {p.label}
                      {selected && (
                        <svg className="ms-1.5 -me-0.5 inline h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving || !name}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
              >
                {saving ? t.common.loading : t.common.save}
              </button>
              <button
                onClick={resetForm}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:bg-bg-light hover:border-border-light active:scale-[0.98]"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clients list */}
      {clients.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-white p-12 text-center">
          <p className="text-text-muted">{t.common.noResults}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-start text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3 text-start">Name</th>
                <th className="px-4 py-3 text-start">{t.dashboard.clientPlatforms}</th>
                <th className="px-4 py-3 text-start">Email</th>
                <th className="px-4 py-3 text-start">Phone</th>
                <th className="px-4 py-3 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-border-light last:border-0 transition-colors hover:bg-bg-subtle"
                >
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">
                    {client.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(client.platforms || []).map((p) => {
                        const info = ALL_PLATFORMS.find((ap) => ap.value === p);
                        return (
                          <span
                            key={p}
                            className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                              info?.color || "bg-bg-subtle text-text-muted border-border"
                            }`}
                          >
                            {info?.label || p}
                          </span>
                        );
                      })}
                      {(!client.platforms || client.platforms.length === 0) && (
                        <span className="text-xs text-text-muted">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {client.contact_email}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {client.contact_phone}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      onClick={() => handleEdit(client)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary/5 active:scale-[0.97]"
                    >
                      {t.common.edit}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
