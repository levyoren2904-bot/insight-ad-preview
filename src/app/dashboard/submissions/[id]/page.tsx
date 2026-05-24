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
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, FileTextIcon, Loader2Icon, CopyIcon, CheckIcon, MailIcon } from "lucide-react";

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

  const [editUrl, setEditUrl] = useState<string | null>(null);
  const [editUrlCopied, setEditUrlCopied] = useState(false);

  const handleSaveStatus = async () => {
    setSaving(true);

    if (status === "needs_changes") {
      // Generate edit token and send notification
      const editToken = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}`;

      try {
        const res = await fetch("/api/notify-changes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: id,
            notes,
            editToken,
          }),
        });
        const result = await res.json();

        if (result.success) {
          setEditUrl(result.editUrl);
          if (result.emailSent) {
            toast.success(t.dashboard.notificationSent);
          } else {
            toast.info(t.dashboard.statusSavedNoEmail);
          }
        } else {
          await supabase
            .from("submissions")
            .update({ status, admin_notes: notes, edit_token: editToken })
            .eq("id", id);
          setEditUrl(`${window.location.origin}/submit/edit/${editToken}`);
          toast.success(t.dashboard.statusSaved);
        }
      } catch {
        await supabase
          .from("submissions")
          .update({ status, admin_notes: notes })
          .eq("id", id);
        toast.error(t.dashboard.statusSaved);
      }
    } else {
      await supabase
        .from("submissions")
        .update({ status, admin_notes: notes })
        .eq("id", id);
      setEditUrl(null);
      toast.success(t.dashboard.statusSaved);
    }

    setSaving(false);
    fetchSubmission();
  };

  const copyEditUrl = async () => {
    if (!editUrl) return;
    await navigator.clipboard.writeText(editUrl);
    setEditUrlCopied(true);
    setTimeout(() => setEditUrlCopied(false), 2000);
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
        const filledHeadlines = (g.headlines || []).filter((h) => h.text);
        const filledDescs = (g.descriptions || []).filter((d) => d.text);
        const posLabel = (pos: number | null) => pos ? ` (${t.google.position} ${pos})` : "";
        return (
          <>
            <CopyField label={t.google.companyUrl} value={g.companyUrl} />
            <CopyField label={t.google.displayPath1} value={g.displayPath1} />
            {g.displayPath2 && <CopyField label={t.google.displayPath2} value={g.displayPath2} />}
            {filledHeadlines.map((h, i) => (
              <CopyField key={`h${i}`} label={`${t.google.headline} ${i + 1}${posLabel(h.position)}`} value={h.text} />
            ))}
            {filledDescs.map((d, i) => (
              <CopyField key={`d${i}`} label={`${t.google.description} ${i + 1}${posLabel(d.position)}`} value={d.text} multiline />
            ))}
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <a
            href="/dashboard"
            className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-2 -ms-2 h-7 px-2 text-muted-foreground" })}
          >
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            {t.common.back}
          </a>
          <h1 className="text-2xl font-bold text-text-primary">
            {t.dashboard.submissionDetail}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
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
              className={buttonVariants({ size: "lg", className: "bg-teal text-white hover:bg-teal/90" })}
            >
              <FileTextIcon className="size-4" />
              {t.dashboard.startPublishing}
            </a>
          </div>

          {/* Content fields with copy */}
          <div className="flex flex-col gap-2">
            {renderContentFields()}
          </div>

          {/* Status controls */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {t.dashboard.changeStatus}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {(["pending", "approved", "needs_changes"] as SubmissionStatus[]).map(
                  (s) => (
                    <Button
                      key={s}
                      onClick={() => setStatus(s)}
                      variant={status === s ? "default" : "outline"}
                      size="sm"
                      className={status === s && s === "needs_changes" ? "bg-coral text-white hover:bg-coral/90" : status === s && s === "approved" ? "bg-teal text-white hover:bg-teal/90" : ""}
                    >
                      {t.status[s === "needs_changes" ? "needsChanges" : s]}
                    </Button>
                  )
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-notes" className="text-xs">
                  {t.dashboard.adminNotes}
                </Label>
                <Textarea
                  id="admin-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={status === "needs_changes" ? "What needs to change?" : ""}
                />
              </div>

              <Button onClick={handleSaveStatus} disabled={saving} className="self-start">
                {saving ? (
                  <><Loader2Icon className="size-4 animate-spin" /> {t.common.loading}</>
                ) : status === "needs_changes" ? (
                  <><MailIcon className="size-4" /> {t.dashboard.saveAndNotify}</>
                ) : (
                  t.common.save
                )}
              </Button>

              {/* Edit URL for needs_changes */}
              {editUrl && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="mb-2 text-xs font-medium text-amber-800">
                    {t.dashboard.editLinkReady}
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={editUrl}
                      className="flex-1 h-8 text-xs border-amber-200"
                    />
                    <Button
                      onClick={copyEditUrl}
                      size="sm"
                      className="bg-amber-600 text-white hover:bg-amber-700"
                    >
                      {editUrlCopied ? <><CheckIcon className="size-3" /> {t.common.copied}</> : <><CopyIcon className="size-3" /> {t.common.copy}</>}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
