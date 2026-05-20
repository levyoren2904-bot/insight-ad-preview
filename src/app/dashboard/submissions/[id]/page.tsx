"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type {
  Submission,
  SubmissionStatus,
  Platform,
  GoogleAdContent,
  FacebookAdContent,
  LinkedInAdContent,
  PinterestAdContent,
  PlatformContent,
} from "@/lib/types";
import PlatformTabs from "@/components/forms/PlatformTabs";
import PreviewPanel from "@/components/preview/PreviewPanel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import CopyField from "@/components/dashboard/CopyField";
import CopyAllButton from "@/components/dashboard/CopyAllButton";
import ExportButtons from "@/components/dashboard/ExportButtons";
import PlatformQuickLinks from "@/components/dashboard/PlatformQuickLinks";
import {
  defaultGoogleAd,
  defaultFacebookAd,
  defaultLinkedInAd,
  defaultPinterestAd,
} from "@/lib/defaults";
import Toast from "@/components/ui/Toast";

type FormData = {
  google: GoogleAdContent;
  facebook: FacebookAdContent;
  instagram: FacebookAdContent;
  linkedin: LinkedInAdContent;
  pinterest: PinterestAdContent;
};

export default function SubmissionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useI18n();
  const previewRef = useRef<HTMLDivElement>(null);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<Platform>("google");
  const [status, setStatus] = useState<SubmissionStatus>("pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchSubmission = useCallback(async () => {
    const { data } = await supabase
      .from("submissions")
      .select("*, client:clients(*), content:submission_content(*)")
      .eq("id", id)
      .single();

    if (data) {
      setSubmission(data as Submission);
      setStatus(data.status);
      setNotes(data.admin_notes || "");
      const platforms = (data.content || []).map(
        (c: { platform: Platform }) => c.platform
      );
      if (platforms.length > 0) {
        setActivePlatform(platforms[0]);
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const handleSaveStatus = async () => {
    setSaving(true);
    await supabase
      .from("submissions")
      .update({ status, admin_notes: notes })
      .eq("id", id);
    setSaving(false);
    setToast(t.dashboard.statusSaved);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="rounded-xl border border-border bg-bg-white p-8 text-center">
        <p className="text-text-muted">Submission not found</p>
      </div>
    );
  }

  const platforms = (submission.content || []).map((c) => c.platform);
  const activeContent = submission.content?.find(
    (c) => c.platform === activePlatform
  );

  const formData: FormData = {
    google: { ...defaultGoogleAd },
    facebook: { ...defaultFacebookAd },
    instagram: { ...defaultFacebookAd },
    linkedin: { ...defaultLinkedInAd },
    pinterest: { ...defaultPinterestAd },
  };

  for (const content of submission.content || []) {
    (formData as Record<string, unknown>)[content.platform] = content.content;
  }

  const renderContentFields = () => {
    if (!activeContent) return null;
    const content = activeContent.content;

    switch (activePlatform) {
      case "google": {
        const g = content as GoogleAdContent;
        return (
          <>
            <CopyField label={t.google.companyUrl} value={g.companyUrl} />
            <CopyField label={t.google.displayPath} value={g.displayPath} />
            <CopyField label={t.google.headline1} value={g.headline1} />
            <CopyField label={t.google.headline2} value={g.headline2} />
            <CopyField label={t.google.headline3} value={g.headline3} />
            <CopyField label={t.google.description1} value={g.description1} multiline />
            <CopyField label={t.google.description2} value={g.description2} multiline />
          </>
        );
      }
      case "facebook":
      case "instagram": {
        const f = content as FacebookAdContent;
        return (
          <>
            <CopyField label={t.facebook.pageName} value={f.pageName} />
            <CopyField label={t.facebook.primaryText} value={f.primaryText} multiline />
            <CopyField label={t.facebook.headline} value={f.headline} />
            <CopyField label={t.facebook.description} value={f.description} />
            <CopyField label={t.facebook.ctaButton} value={f.ctaButton} />
            <CopyField label={t.facebook.adFormat} value={f.adFormat} />
          </>
        );
      }
      case "linkedin": {
        const l = content as LinkedInAdContent;
        return (
          <>
            <CopyField label={t.linkedin.companyName} value={l.companyName} />
            <CopyField label={t.linkedin.introText} value={l.introText} multiline />
            <CopyField label={t.linkedin.headline} value={l.headline} />
            <CopyField label={t.linkedin.description} value={l.description} />
            <CopyField label={t.linkedin.ctaButton} value={l.ctaButton} />
            <CopyField label={t.linkedin.adFormat} value={l.adFormat} />
          </>
        );
      }
      case "pinterest": {
        const p = content as PinterestAdContent;
        return (
          <>
            <CopyField label={t.pinterest.pinTitle} value={p.pinTitle} />
            <CopyField label={t.pinterest.pinDescription} value={p.pinDescription} multiline />
            <CopyField label={t.pinterest.destinationUrl} value={p.destinationUrl} />
            <CopyField label={t.pinterest.boardName} value={p.boardName} />
          </>
        );
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <a
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t.common.back}
          </a>
          <h1 className="text-2xl font-bold text-text-primary">
            {t.dashboard.submissionDetail}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {submission.client?.name} - {new Date(submission.created_at).toLocaleDateString("en-GB")}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {/* Platform tabs */}
      <PlatformTabs
        activePlatform={activePlatform}
        onSelect={setActivePlatform}
        allowedPlatforms={platforms}
      />

      <div className="mt-6 flex gap-6">
        {/* Content + controls */}
        <div className="w-full lg:w-1/2">
          {/* Action bar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {activeContent && (
              <CopyAllButton
                platform={activePlatform}
                content={activeContent.content}
              />
            )}
            <PlatformQuickLinks platform={activePlatform} />
            <a
              href={`/dashboard/submissions/${id}/publish/${activePlatform}`}
              className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal/90 hover:shadow active:scale-[0.98]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t.dashboard.startPublishing}
            </a>
          </div>

          {/* Content fields with copy */}
          <div className="flex flex-col gap-2">
            {renderContentFields()}
          </div>

          {/* Status controls */}
          <div className="mt-6 rounded-xl border border-border bg-bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-text-muted">
              {t.dashboard.changeStatus}
            </h3>
            <div className="flex gap-2">
              {(["pending", "approved", "needs_changes"] as SubmissionStatus[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      status === s
                        ? "bg-primary text-white"
                        : "border border-border text-text-secondary hover:border-primary/50"
                    }`}
                  >
                    {t.status[s === "needs_changes" ? "needsChanges" : s]}
                  </button>
                )
              )}
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-text-muted">
                {t.dashboard.adminNotes}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-bg-subtle px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={handleSaveStatus}
              disabled={saving}
              className="mt-3 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
            >
              {saving ? t.common.loading : t.common.save}
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="mb-3">
              <ExportButtons
                previewRef={previewRef}
                filename={`${submission.client?.name || "ad"}-${activePlatform}`}
              />
            </div>
            <PreviewPanel ref={previewRef} platform={activePlatform} data={formData} />
        </div>
      </div>
    </div>
  );
}
