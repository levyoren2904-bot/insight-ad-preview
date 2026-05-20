"use client";

import { useI18n } from "@/lib/i18n";
import {
  LinkedInAdContent,
  CHAR_LIMITS,
  CTA_OPTIONS,
  CtaOption,
  AdFormat,
} from "@/lib/types";
import TextField from "./shared/TextField";
import ImageUpload from "./shared/ImageUpload";
import SelectField from "./shared/SelectField";
import FormatToggle from "./shared/FormatToggle";

interface LinkedInAdFormProps {
  data: LinkedInAdContent;
  onChange: (data: LinkedInAdContent) => void;
  onImageFile: (field: string, file: File | null) => void;
}

export default function LinkedInAdForm({
  data,
  onChange,
  onImageFile,
}: LinkedInAdFormProps) {
  const { t } = useI18n();
  const limits = CHAR_LIMITS.linkedin;

  const update = (field: keyof LinkedInAdContent, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const ctaOptions = CTA_OPTIONS.map((cta) => ({
    value: cta,
    label: t.cta[cta.replace("_", "") as keyof typeof t.cta] || cta,
  }));

  const formatOptions = [
    { value: "feed_image", label: t.linkedin.feedImage },
    { value: "carousel", label: t.linkedin.carousel },
  ];

  return (
    <div className="flex flex-col gap-4">
      <FormatToggle
        label={t.linkedin.adFormat}
        options={formatOptions}
        value={data.adFormat}
        onChange={(v) =>
          onChange({ ...data, adFormat: v as Exclude<AdFormat, "story"> })
        }
      />
      <TextField
        label={t.linkedin.companyName}
        value={data.companyName}
        onChange={(v) => update("companyName", v)}
        required
      />
      <ImageUpload
        label={t.linkedin.companyLogo}
        value={data.companyLogo}
        onChange={(file, url) => {
          onImageFile("companyLogo", file);
          onChange({ ...data, companyLogo: url });
        }}
      />
      <TextField
        label={t.linkedin.introText}
        value={data.introText}
        onChange={(v) => update("introText", v)}
        maxChars={limits.introText}
        multiline
        required
      />
      <ImageUpload
        label={t.linkedin.adImage}
        value={data.adImage}
        onChange={(file, url) => {
          onImageFile("adImage", file);
          onChange({ ...data, adImage: url });
        }}
      />
      <TextField
        label={t.linkedin.headline}
        value={data.headline}
        onChange={(v) => update("headline", v)}
        maxChars={limits.headline}
        required
      />
      <TextField
        label={t.linkedin.description}
        value={data.description}
        onChange={(v) => update("description", v)}
        maxChars={limits.description}
        optional
      />
      <SelectField
        label={t.linkedin.ctaButton}
        value={data.ctaButton}
        onChange={(v) => onChange({ ...data, ctaButton: v as CtaOption })}
        options={ctaOptions}
        required
      />
    </div>
  );
}
