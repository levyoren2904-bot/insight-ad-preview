"use client";

import { useI18n } from "@/lib/i18n";
import {
  FacebookAdContent,
  CHAR_LIMITS,
  CTA_OPTIONS,
  CtaOption,
  AdFormat,
} from "@/lib/types";
import { fieldTips } from "@/lib/field-tips";
import { facebookImageSpecs } from "@/lib/image-specs";
import TextField from "./shared/TextField";
import ImageUpload from "./shared/ImageUpload";
import SelectField from "./shared/SelectField";
import FormatToggle from "./shared/FormatToggle";

interface FacebookAdFormProps {
  data: FacebookAdContent;
  onChange: (data: FacebookAdContent) => void;
  onImageFile: (field: string, file: File | null) => void;
}

export default function FacebookAdForm({
  data,
  onChange,
  onImageFile,
}: FacebookAdFormProps) {
  const { t, locale } = useI18n();
  const limits = CHAR_LIMITS.facebook;
  const tips = fieldTips.facebook;
  const tip = (field: string) => tips[field]?.[locale];
  const imgSpecs = facebookImageSpecs[data.adFormat] || facebookImageSpecs.feed_image;
  const imgHint = (field: string) => imgSpecs[field]?.label[locale];
  const imgAspect = (field: string) => imgSpecs[field]?.aspectRatio;

  const update = (field: keyof FacebookAdContent, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const ctaOptions = CTA_OPTIONS.map((cta) => ({
    value: cta,
    label: t.cta[cta.replace("_", "") as keyof typeof t.cta] || cta,
  }));

  const formatOptions = [
    { value: "feed_image", label: t.facebook.feedImage },
    { value: "carousel", label: t.facebook.carousel },
    { value: "story", label: t.facebook.story },
  ];

  return (
    <div className="flex flex-col gap-4">
      <FormatToggle
        label={t.facebook.adFormat}
        options={formatOptions}
        value={data.adFormat}
        onChange={(v) => onChange({ ...data, adFormat: v as AdFormat })}
      />
      <TextField
        label={t.facebook.pageName}
        value={data.pageName}
        onChange={(v) => update("pageName", v)}
        required
        tip={tip("pageName")}
      />
      <ImageUpload
        label={t.facebook.profileImage}
        value={data.profileImage}
        onChange={(file, url) => {
          onImageFile("profileImage", file);
          onChange({ ...data, profileImage: url });
        }}
        aspectRatio={imgAspect("profileImage")}
        dimensionHint={imgHint("profileImage")}
      />
      <TextField
        label={t.facebook.primaryText}
        value={data.primaryText}
        onChange={(v) => update("primaryText", v)}
        maxChars={limits.primaryText}
        multiline
        required
        tip={tip("primaryText")}
      />
      <ImageUpload
        label={t.facebook.adImage}
        value={data.adImage}
        onChange={(file, url) => {
          onImageFile("adImage", file);
          onChange({ ...data, adImage: url });
        }}
        aspectRatio={imgAspect("adImage")}
        dimensionHint={imgHint("adImage")}
      />
      <TextField
        label={t.facebook.headline}
        value={data.headline}
        onChange={(v) => update("headline", v)}
        maxChars={limits.headline}
        required
        tip={tip("headline")}
      />
      <TextField
        label={t.facebook.description}
        value={data.description}
        onChange={(v) => update("description", v)}
        maxChars={limits.description}
        optional
        tip={tip("description")}
      />
      <SelectField
        label={t.facebook.ctaButton}
        value={data.ctaButton}
        onChange={(v) => onChange({ ...data, ctaButton: v as CtaOption })}
        options={ctaOptions}
        required
      />
    </div>
  );
}
