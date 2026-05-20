"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { SubmissionLink, Client, Platform, PLATFORM_LIST } from "@/lib/types";

export default function LinksPage() {
  const { t } = useI18n();
  const [links, setLinks] = useState<SubmissionLink[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allPlatforms: Platform[] = ["google", "facebook", "instagram", "linkedin", "pinterest"];

  const fetchData = async () => {
    const [linksRes, clientsRes] = await Promise.all([
      supabase
        .from("submission_links")
        .select("*, client:clients(*)")
        .order("created_at", { ascending: false }),
      supabase.from("clients").select("*").order("name"),
    ]);
    setLinks((linksRes.data as SubmissionLink[]) || []);
    setClients((clientsRes.data as Client[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const generateToken = () => {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  };

  const handleGenerate = async () => {
    if (!selectedClient || selectedPlatforms.length === 0) return;
    setGenerating(true);

    const token = generateToken();
    await supabase.from("submission_links").insert({
      client_id: selectedClient,
      token,
      platforms: selectedPlatforms,
      expires_at: expiryDate || null,
    });

    setGenerating(false);
    setShowForm(false);
    setSelectedClient("");
    setSelectedPlatforms([]);
    setExpiryDate("");
    fetchData();
  };

  const copyLink = async (token: string, linkId: string) => {
    const url = `${window.location.origin}/submit/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          {t.dashboard.links}
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t.dashboard.newLink}
        </button>
      </div>

      {/* Generate link form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            {t.dashboard.generateLink}
          </h2>
          <div className="flex flex-col gap-4">
            {/* Client select */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                {t.dashboard.clients}
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              >
                <option value="">{t.dashboard.allClients}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Platforms */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                {t.dashboard.selectPlatforms}
              </label>
              <div className="flex flex-wrap gap-2">
                {allPlatforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedPlatforms.includes(p)
                        ? "bg-primary text-white"
                        : "border border-border text-text-secondary hover:border-primary/50"
                    }`}
                  >
                    {t.platforms[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Expiry */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                {t.dashboard.expiryDate}
                <span className="ms-1 text-xs text-text-muted">
                  ({t.common.optional})
                </span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-border bg-bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedClient || selectedPlatforms.length === 0}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {generating ? t.common.loading : t.dashboard.generateLink}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-light"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links list */}
      {links.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-white p-12 text-center">
          <p className="text-text-muted">{t.common.noResults}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-start text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3 text-start">Client</th>
                <th className="px-4 py-3 text-start">Platforms</th>
                <th className="px-4 py-3 text-start">Expires</th>
                <th className="px-4 py-3 text-start">Created</th>
                <th className="px-4 py-3 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const isExpired =
                  link.expires_at && new Date(link.expires_at) < new Date();
                return (
                  <tr
                    key={link.id}
                    className={`border-b border-border-light last:border-0 transition-colors hover:bg-bg-subtle ${isExpired ? "opacity-50" : ""}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">
                      {link.client?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {link.platforms.map((p) => (
                          <span
                            key={p}
                            className="rounded-full bg-bg-light px-2 py-0.5 text-[10px] font-semibold text-text-muted"
                          >
                            {t.platforms[p as Platform]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {link.expires_at ? (
                        <span className={isExpired ? "text-coral" : ""}>
                          {formatDate(link.expires_at)}
                        </span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(link.created_at)}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        onClick={() => copyLink(link.token, link.id)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                      >
                        {copiedId === link.id
                          ? t.common.copied
                          : t.dashboard.copyLink}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
