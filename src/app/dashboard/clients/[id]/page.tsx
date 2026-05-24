"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type {
  Client,
  Platform,
  SubmissionLink,
  Submission,
} from "@/lib/types";
import PlatformLogo from "@/components/ui/PlatformLogo";
import Toast from "@/components/ui/Toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon, XIcon } from "lucide-react";

const ALL_PLATFORMS: Platform[] = [
  "google",
  "facebook",
  "instagram",
  "linkedin",
  "pinterest",
];

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const { t } = useI18n();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Client form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  // Links
  const [links, setLinks] = useState<SubmissionLink[]>([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkPlatforms, setLinkPlatforms] = useState<Platform[]>([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const fetchData = useCallback(async () => {
    const [clientRes, linksRes, subsRes] = await Promise.all([
      supabase.from("clients").select("*").eq("id", clientId).single(),
      supabase
        .from("submission_links")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
      supabase
        .from("submissions")
        .select("*, content:submission_content(*)")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }),
    ]);

    if (clientRes.data) {
      const c = clientRes.data as Client;
      setClient(c);
      setName(c.name);
      setEmail(c.contact_email);
      setPhone(c.contact_phone);
      setPlatforms(c.platforms || []);
    }
    setLinks((linksRes.data as SubmissionLink[]) || []);
    setSubmissions((subsRes.data as Submission[]) || []);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("clients")
      .update({
        name,
        contact_email: email,
        contact_phone: phone,
        platforms,
      })
      .eq("id", clientId);
    setSaving(false);
    setToast({ message: t.dashboard.clientSaved, type: "success" });
  };

  const generateToken = () => {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  };

  const handleGenerateLink = async () => {
    if (linkPlatforms.length === 0) return;
    setGeneratingLink(true);
    const token = generateToken();
    await supabase.from("submission_links").insert({
      client_id: clientId,
      token,
      platforms: linkPlatforms,
      expires_at: expiryDate || null,
    });
    setGeneratingLink(false);
    setShowLinkForm(false);
    setLinkPlatforms([]);
    setExpiryDate("");
    setToast({ message: t.dashboard.linkGenerated, type: "success" });
    fetchData();
  };

  const copyLink = async (token: string, linkId: string) => {
    const url = `${window.location.origin}/submit/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteLink = async (linkId: string) => {
    await supabase.from("submission_links").delete().eq("id", linkId);
    setToast({ message: t.dashboard.linkDeleted, type: "success" });
    fetchData();
  };

  const deleteClient = async () => {
    if (submissions.length > 0) {
      setToast({
        message: t.dashboard.clientHasSubmissions,
        type: "error",
      });
      return;
    }
    // Delete all links first (foreign key), then the client
    await supabase.from("submission_links").delete().eq("client_id", clientId);
    await supabase.from("clients").delete().eq("id", clientId);
    router.push("/dashboard/clients");
  };

  const toggleLinkPlatform = (p: Platform) => {
    setLinkPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
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

  if (!client) {
    return (
      <div className="rounded-xl border border-border bg-bg-white p-8 text-center">
        <p className="text-text-muted">{t.common.noResults}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
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
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            {t.dashboard.clientDetails}
          </h1>
        </div>
      </div>

      {/* Client info form */}
      <div className="mb-6 rounded-xl border border-border bg-bg-white p-6 shadow-sm">
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

          <div className="pt-1">
            <button
              onClick={handleSave}
              disabled={saving || !name}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
            >
              {saving ? t.common.loading : t.common.save}
            </button>
          </div>
        </div>
      </div>

      {/* Links section */}
      <div className="mb-6 rounded-xl border border-border bg-bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {t.dashboard.activeLinks}
          </h2>
          <button
            onClick={() => {
              setLinkPlatforms(platforms.length > 0 ? [...platforms] : []);
              setShowLinkForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary/20 active:scale-[0.98]"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t.dashboard.generateLink}
          </button>
        </div>

        {/* Generate link form */}
        {showLinkForm && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-col gap-3">
              {/* Platforms for link */}
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  {t.dashboard.selectPlatforms}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_PLATFORMS.map((p) => {
                    const selected = linkPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => toggleLinkPlatform(p)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          selected
                            ? "border-primary/30 bg-primary text-white"
                            : "border-border bg-bg-white text-text-secondary hover:border-primary/30"
                        }`}
                      >
                        <PlatformLogo
                          platform={p}
                          size={14}
                          className={selected ? "brightness-0 invert" : ""}
                        />
                        {t.platforms[p]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">
                  {t.dashboard.expiryDate}
                  <span className="ms-1 text-text-muted">
                    ({t.common.optional})
                  </span>
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="max-w-xs rounded-lg border border-border bg-bg-white px-3 py-1.5 text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGenerateLink}
                  disabled={generatingLink || linkPlatforms.length === 0}
                  className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                >
                  {generatingLink
                    ? t.common.loading
                    : t.dashboard.generateLink}
                </button>
                <button
                  onClick={() => setShowLinkForm(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-all hover:bg-bg-light active:scale-[0.98]"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Links list */}
        {links.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">
            {t.dashboard.noLinks}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const isExpired =
                link.expires_at && new Date(link.expires_at) < new Date();
              return (
                <div
                  key={link.id}
                  className={`flex items-center gap-3 rounded-lg border border-border-light p-3 transition-colors hover:bg-bg-subtle ${
                    isExpired ? "opacity-50" : ""
                  }`}
                >
                  {/* Platform logos */}
                  <div className="flex items-center gap-1">
                    {link.platforms.map((p) => (
                      <PlatformLogo
                        key={p}
                        platform={p as Platform}
                        size={16}
                      />
                    ))}
                  </div>

                  {/* Date info */}
                  <div className="flex-1 text-xs text-text-muted">
                    {formatDate(link.created_at)}
                    {link.expires_at && (
                      <span
                        className={`ms-2 ${isExpired ? "text-coral" : ""}`}
                      >
                        - {isExpired ? "Expired" : "Expires"}{" "}
                        {formatDate(link.expires_at)}
                      </span>
                    )}
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => copyLink(link.token, link.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/5 active:scale-[0.97]"
                  >
                    {copiedId === link.id ? (
                      <>
                        <svg
                          className="h-3.5 w-3.5 text-teal"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {t.common.copied}
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                        {t.dashboard.copyLink}
                      </>
                    )}
                  </button>

                  {/* Delete link button */}
                  <AlertDialog>
                    <AlertDialogTrigger
                      aria-label="Delete link"
                      className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                    >
                      <XIcon className="size-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t.dashboard.deleteLinkConfirmTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t.dashboard.deleteLinkConfirmDesc}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteLink(link.id)}
                          className="bg-coral text-white hover:bg-coral/90"
                        >
                          {t.common.delete}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submissions section */}
      <div className="rounded-xl border border-border bg-bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          {t.dashboard.submissionHistory}
        </h2>
        {submissions.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">
            {t.dashboard.noSubmissions}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {submissions.map((sub) => {
              const subPlatforms = (sub.content || []).map((c) => c.platform);
              const statusColors: Record<string, string> = {
                pending:
                  "bg-amber-50 text-amber-700 border-amber-200",
                approved:
                  "bg-emerald-50 text-emerald-700 border-emerald-200",
                needs_changes:
                  "bg-rose-50 text-rose-700 border-rose-200",
              };
              return (
                <a
                  key={sub.id}
                  href={`/dashboard/submissions/${sub.id}`}
                  className="group flex items-center gap-3 rounded-lg border border-border-light p-3 transition-all hover:border-primary/30 hover:bg-bg-subtle"
                >
                  {/* Platform logos */}
                  <div className="flex items-center gap-1">
                    {subPlatforms.map((p) => (
                      <PlatformLogo key={p} platform={p} size={16} />
                    ))}
                  </div>

                  {/* Date */}
                  <span className="flex-1 text-xs text-text-muted">
                    {formatDate(sub.created_at)}
                  </span>

                  {/* Status */}
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      statusColors[sub.status] || ""
                    }`}
                  >
                    {t.status[
                      sub.status === "needs_changes"
                        ? "needsChanges"
                        : sub.status
                    ]}
                  </span>

                  {/* Chevron */}
                  <svg
                    className="h-4 w-4 text-text-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="mt-8 rounded-xl border border-coral/20 bg-coral/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t.dashboard.dangerZone}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {submissions.length > 0
                ? t.dashboard.clientHasSubmissions
                : t.dashboard.deleteClientDesc}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger
              disabled={submissions.length > 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-coral/10 px-2.5 py-1.5 text-xs font-medium text-coral transition-colors hover:bg-coral/20 disabled:pointer-events-none disabled:opacity-50"
            >
              <Trash2Icon className="size-3.5" />
              {t.dashboard.deleteClient}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t.dashboard.deleteClientConfirmTitle}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t.dashboard.deleteClientConfirmDesc.replace("{name}", client.name)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteClient}
                  className="bg-coral text-white hover:bg-coral/90"
                >
                  {t.common.delete}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
