"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import PlatformTabs from "@/components/forms/PlatformTabs";
import GoogleAdForm from "@/components/forms/GoogleAdForm";
import FacebookAdForm from "@/components/forms/FacebookAdForm";
import LinkedInAdForm from "@/components/forms/LinkedInAdForm";
import PinterestAdForm from "@/components/forms/PinterestAdForm";
import PreviewPanel from "@/components/preview/PreviewPanel";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import {
  defaultGoogleAd,
  defaultFacebookAd,
  defaultLinkedInAd,
  defaultPinterestAd,
} from "@/lib/defaults";
import type {
  Platform,
  GoogleAdContent,
  FacebookAdContent,
  LinkedInAdContent,
  PinterestAdContent,
  PlatformContent,
  SubmissionLink,
} from "@/lib/types";

type FormData = {
  google: GoogleAdContent;
  facebook: FacebookAdContent;
  instagram: FacebookAdContent;
  linkedin: LinkedInAdContent;
  pinterest: PinterestAdContent;
};

export default function SubmitPage() {
  const params = useParams();
  const token = params.token as string;
  const { t } = useI18n();

  const [link, setLink] = useState<SubmissionLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<Platform>("google");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const imageFiles = useRef<Record<string, Record<string, File | null>>>({});

  const [formData, setFormData] = useState<FormData>({
    google: { ...defaultGoogleAd },
    facebook: { ...defaultFacebookAd },
    instagram: { ...defaultFacebookAd },
    linkedin: { ...defaultLinkedInAd },
    pinterest: { ...defaultPinterestAd },
  });

  useEffect(() => {
    async function validateToken() {
      const { data, error: fetchError } = await supabase
        .from("submission_links")
        .select("*, client:clients(*)")
        .eq("token", token)
        .single();

      if (fetchError || !data) {
        setError(t.submission.linkInvalid);
        setLoading(false);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError(t.submission.linkExpired);
        setLoading(false);
        return;
      }

      setLink(data as SubmissionLink);
      setActivePlatform(data.platforms[0] as Platform);
      setLoading(false);
    }

    validateToken();
  }, [token, t]);

  const handleImageFile = useCallback(
    (platform: Platform, field: string, file: File | null) => {
      if (!imageFiles.current[platform]) {
        imageFiles.current[platform] = {};
      }
      imageFiles.current[platform][field] = file;
    },
    []
  );

  const updatePlatformData = useCallback(
    <P extends Platform>(platform: P, data: FormData[P]) => {
      setFormData((prev) => ({ ...prev, [platform]: data }));
    },
    []
  );

  const handleSubmit = async () => {
    if (!link) return;
    setSubmitting(true);

    try {
      const { data: submission, error: subError } = await supabase
        .from("submissions")
        .insert({
          link_id: link.id,
          client_id: link.client_id,
          status: "pending",
        })
        .select()
        .single();

      if (subError || !submission) throw subError;

      for (const platform of link.platforms) {
        const content = formData[platform as keyof FormData];
        await supabase.from("submission_content").insert({
          submission_id: submission.id,
          platform,
          content: content as unknown as Record<string, unknown>,
        });

        const platformFiles = imageFiles.current[platform];
        if (platformFiles) {
          for (const [fieldName, file] of Object.entries(platformFiles)) {
            if (!file) continue;
            const path = `${submission.id}/${platform}/${fieldName}-${file.name}`;
            await supabase.storage.from("ad-images").upload(path, file);
            await supabase.from("images").insert({
              submission_id: submission.id,
              platform,
              field_name: fieldName,
              storage_path: path,
              original_filename: file.name,
            });
          }
        }
      }

      setSubmitted(true);
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <div className="rounded-xl border border-border bg-bg-subtle p-8 text-center">
            <p className="text-lg text-text-secondary">{error}</p>
          </div>
        </main>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <div className="rounded-xl border border-teal/30 bg-teal/5 p-8 text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-text-primary">
              {t.submission.successTitle}
            </h2>
            <p className="mt-2 text-text-secondary">
              {t.submission.successMessage}
            </p>
          </div>
        </main>
      </>
    );
  }

  const renderForm = () => {
    switch (activePlatform) {
      case "google":
        return (
          <GoogleAdForm
            data={formData.google}
            onChange={(d) => updatePlatformData("google", d)}
          />
        );
      case "facebook":
        return (
          <FacebookAdForm
            data={formData.facebook}
            onChange={(d) => updatePlatformData("facebook", d)}
            onImageFile={(field, file) =>
              handleImageFile("facebook", field, file)
            }
          />
        );
      case "instagram":
        return (
          <FacebookAdForm
            data={formData.instagram}
            onChange={(d) => updatePlatformData("instagram", d)}
            onImageFile={(field, file) =>
              handleImageFile("instagram", field, file)
            }
          />
        );
      case "linkedin":
        return (
          <LinkedInAdForm
            data={formData.linkedin}
            onChange={(d) => updatePlatformData("linkedin", d)}
            onImageFile={(field, file) =>
              handleImageFile("linkedin", field, file)
            }
          />
        );
      case "pinterest":
        return (
          <PinterestAdForm
            data={formData.pinterest}
            onChange={(d) => updatePlatformData("pinterest", d)}
            onImageFile={(field, file) =>
              handleImageFile("pinterest", field, file)
            }
          />
        );
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="mx-auto w-full max-w-7xl">
          <h1 className="mb-4 text-2xl font-bold text-text-primary">
            {t.submission.title}
          </h1>
          <PlatformTabs
            activePlatform={activePlatform}
            onSelect={setActivePlatform}
            allowedPlatforms={link?.platforms || []}
          />
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6">
          {/* Form panel */}
          <div className="w-full lg:w-1/2">
            <div className="rounded-xl border border-border bg-bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
                {t.platforms[activePlatform]}
              </h2>
              {renderForm()}
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-xl bg-primary py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {submitting ? t.common.loading : t.submission.submitForReview}
              </button>
            </div>
          </div>

          {/* Live preview panel */}
          <div className="hidden lg:block lg:w-1/2">
            <PreviewPanel platform={activePlatform} data={formData} />
          </div>
        </div>
      </main>
    </>
  );
}
