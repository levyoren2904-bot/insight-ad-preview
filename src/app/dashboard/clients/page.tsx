"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Client } from "@/lib/types";

export default function ClientsPage() {
  const { t } = useI18n();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

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
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setName(client.name);
    setEmail(client.contact_email);
    setPhone(client.contact_phone);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editingId) {
      await supabase
        .from("clients")
        .update({ name, contact_email: email, contact_phone: phone })
        .eq("id", editingId);
    } else {
      await supabase
        .from("clients")
        .insert({ name, contact_email: email, contact_phone: phone });
    }
    setSaving(false);
    resetForm();
    fetchClients();
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          {t.dashboard.clients}
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
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
                {t.dashboard.clients} name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
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
                  className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
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
                  className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !name}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? t.common.loading : t.common.save}
              </button>
              <button
                onClick={resetForm}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-light"
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
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {client.contact_email}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {client.contact_phone}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      onClick={() => handleEdit(client)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
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
