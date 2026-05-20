"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type {
  Platform,
  GoogleAdContent,
  FacebookAdContent,
  LinkedInAdContent,
  PinterestAdContent,
  PlatformContent,
} from "@/lib/types";
import PublishField from "@/components/dashboard/PublishField";
import PublishImageField from "@/components/dashboard/PublishImageField";

interface FieldDef {
  key: string;
  label: string;
  value: string;
  type?: "text" | "image";
  imageUrl?: string;
}

export default function PublishingChecklistPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const submissionId = params.id as string;
  const platform = params.platform as Platform;

  const [content, setContent] = useState<PlatformContent | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const fetchData = useCallback(async () => {
    const [contentRes, progressRes, imagesRes] = await Promise.all([
      supabase
        .from("submission_content")
        .select("content")
        .eq("submission_id", submissionId)
        .eq("platform", platform)
        .single(),
      supabase
        .from("publishing_progress")
        .select("checked_fields")
        .eq("submission_id", submissionId)
        .eq("platform", platform)
        .single(),
      supabase
        .from("images")
        .select("field_name, storage_path")
        .eq("submission_id", submissionId)
        .eq("platform", platform),
    ]);

    if (contentRes.data) {
      setContent(contentRes.data.content as PlatformContent);
    }
    if (progressRes.data?.checked_fields) {
      const checked: Record<string, boolean> = {};
      for (const f of progressRes.data.checked_fields as string[]) {
        checked[f] = true;
      }
      setCheckedFields(checked);
    }

    // Build image URLs from storage
    if (imagesRes.data) {
      const urls: Record<string, string> = {};
      for (const img of imagesRes.data) {
        const { data } = supabase.storage
          .from("ad-images")
          .getPublicUrl(img.storage_path);
        urls[img.field_name] = data.publicUrl;
      }
      setImageUrls(urls);
    }

    setLoading(false);
  }, [submissionId, platform]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCheck = async (fieldKey: string, checked: boolean) => {
    const updated = { ...checkedFields, [fieldKey]: checked };
    if (!checked) delete updated[fieldKey];
    setCheckedFields(updated);

    const checkedArr = Object.keys(updated).filter((k) => updated[k]);
    await supabase
      .from("publishing_progress")
      .upsert(
        {
          submission_id: submissionId,
          platform,
          checked_fields: checkedArr,
        },
        { onConflict: "submission_id,platform" }
      );
  };

  const handleMarkPublished = async () => {
    setCompleting(true);
    const { data: sub } = await supabase
      .from("submissions")
      .select("published_platforms")
      .eq("id", submissionId)
      .single();

    const current = (sub?.published_platforms as Platform[]) || [];
    if (!current.includes(platform)) {
      await supabase
        .from("submissions")
        .update({
          published_platforms: [...current, platform],
        })
        .eq("id", submissionId);
    }

    router.push(`/dashboard/submissions/${submissionId}`);
  };

  const getFields = (): FieldDef[] => {
    if (!content) return [];

    switch (platform) {
      case "google": {
        const g = content as GoogleAdContent;
        return [
          { key: "companyUrl", label: t.google.companyUrl, value: g.companyUrl },
          { key: "displayPath", label: t.google.displayPath, value: g.displayPath },
          { key: "headline1", label: t.google.headline1, value: g.headline1 },
          { key: "headline2", label: t.google.headline2, value: g.headline2 },
          { key: "headline3", label: t.google.headline3, value: g.headline3 },
          { key: "description1", label: t.google.description1, value: g.description1 },
          { key: "description2", label: t.google.description2, value: g.description2 },
        ];
      }
      case "facebook":
      case "instagram": {
        const f = content as FacebookAdContent;
        return [
          { key: "pageName", label: t.facebook.pageName, value: f.pageName },
          { key: "profileImage", label: t.facebook.profileImage, value: f.profileImage || "", type: "image", imageUrl: imageUrls.profileImage },
          { key: "primaryText", label: t.facebook.primaryText, value: f.primaryText },
          { key: "adImage", label: t.facebook.adImage, value: f.adImage || "", type: "image", imageUrl: imageUrls.adImage },
          { key: "headline", label: t.facebook.headline, value: f.headline },
          { key: "description", label: t.facebook.description, value: f.description },
          { key: "ctaButton", label: t.facebook.ctaButton, value: f.ctaButton },
        ];
      }
      case "linkedin": {
        const l = content as LinkedInAdContent;
        return [
          { key: "companyName", label: t.linkedin.companyName, value: l.companyName },
          { key: "companyLogo", label: t.linkedin.companyLogo, value: l.companyLogo || "", type: "image", imageUrl: imageUrls.companyLogo },
          { key: "introText", label: t.linkedin.introText, value: l.introText },
          { key: "adImage", label: t.linkedin.adImage, value: l.adImage || "", type: "image", imageUrl: imageUrls.adImage },
          { key: "headline", label: t.linkedin.headline, value: l.headline },
          { key: "description", label: t.linkedin.description, value: l.description },
          { key: "ctaButton", label: t.linkedin.ctaButton, value: l.ctaButton },
        ];
      }
      case "pinterest": {
        const p = content as PinterestAdContent;
        return [
          { key: "pinTitle", label: t.pinterest.pinTitle, value: p.pinTitle },
          { key: "pinDescription", label: t.pinterest.pinDescription, value: p.pinDescription },
          { key: "pinImage", label: t.pinterest.pinImage, value: p.pinImage || "", type: "image", imageUrl: imageUrls.pinImage },
          { key: "destinationUrl", label: t.pinterest.destinationUrl, value: p.destinationUrl },
          { key: "boardName", label: t.pinterest.boardName, value: p.boardName },
        ];
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const fields = getFields();
  const nonEmptyFields = fields.filter((f) => f.value || f.imageUrl);
  const checkedCount = Object.values(checkedFields).filter(Boolean).length;
  const totalCount = nonEmptyFields.length;
  const allDone = totalCount > 0 && checkedCount >= totalCount;
  const progressPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="mx-auto max-w-2xl pb-8">
      {/* Header */}
      <div className="mb-6">
        <a
          href={`/dashboard/submissions/${submissionId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t.common.back}
        </a>
        <h1 className="text-2xl font-bold text-text-primary">
          {t.dashboard.publishingChecklist}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {t.platforms[platform]}
        </p>
      </div>

      {/* Sticky progress bar */}
      <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-border bg-bg-light/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-text-secondary">
              {t.publishing.progress}
            </span>
            <span className="font-bold text-primary">
              {checkedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-bg-light">
            <div
              className="h-full rounded-full bg-teal transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">
        {fields.map((field) =>
          field.type === "image" ? (
            <PublishImageField
              key={field.key}
              label={field.label}
              imageUrl={field.imageUrl || null}
              checked={!!checkedFields[field.key]}
              onCheck={(checked) => handleCheck(field.key, checked)}
              isEmpty={!field.imageUrl}
            />
          ) : (
            <PublishField
              key={field.key}
              label={field.label}
              value={field.value}
              checked={!!checkedFields[field.key]}
              onCheck={(checked) => handleCheck(field.key, checked)}
              isEmpty={!field.value}
            />
          )
        )}
      </div>

      {/* Complete button */}
      {allDone && (
        <div className="mt-6">
          <div className="mb-3 rounded-xl border border-teal/30 bg-teal/5 p-4 text-center">
            <p className="font-medium text-teal">
              {t.publishing.allFieldsDone}
            </p>
          </div>
          <button
            onClick={handleMarkPublished}
            disabled={completing}
            className="w-full rounded-xl bg-teal py-3 text-base font-bold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
          >
            {completing ? t.common.loading : t.publishing.markDone}
          </button>
        </div>
      )}
    </div>
  );
}
