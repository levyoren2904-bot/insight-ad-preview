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

const MAX_CAROUSEL_CARDS = 10;
const MIN_CAROUSEL_CARDS = 2;

export default function FacebookAdForm({
  data,
  onChange,
  onImageFile,
}: FacebookAdFormProps) {
  const { t, locale } = useI18n();
  const limits = CHAR_LIMITS.facebook;
  const tips = fieldTips.facebook;
  const tip = (field: string) => tips[field]?.[locale];
  const imgSpecs =
    facebookImageSpecs[data.adFormat] || facebookImageSpecs.feed_image;
  const imgHint = (field: string) => imgSpecs[field]?.label[locale];
  const imgAspect = (field: string) => imgSpecs[field]?.aspectRatio;

  const isCarousel = data.adFormat === "carousel";

  const update = (field: keyof FacebookAdContent, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateCarouselImage = (
    index: number,
    file: File | null,
    url: string | null
  ) => {
    const updated = [...(data.carouselImages || [])];
    updated[index] = url;
    onImageFile(`carouselImage_${index}`, file);
    onChange({ ...data, carouselImages: updated });
  };

  const addCarouselCard = () => {
    const current = data.carouselImages || [];
    if (current.length < MAX_CAROUSEL_CARDS) {
      onChange({ ...data, carouselImages: [...current, null] });
    }
  };

  const removeCarouselCard = (index: number) => {
    const current = data.carouselImages || [];
    if (current.length > MIN_CAROUSEL_CARDS) {
      const updated = current.filter((_, i) => i !== index);
      onChange({ ...data, carouselImages: updated });
    }
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

      {/* Image section - single or carousel */}
      {isCarousel ? (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-text-primary">
            {t.facebook.adImage} - {t.facebook.carousel}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(data.carouselImages || [null, null, null]).map((img, i) => (
              <div key={i} className="relative">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-muted">
                    {t.dashboard.carouselCard} {i + 1}
                  </span>
                  {(data.carouselImages || []).length > MIN_CAROUSEL_CARDS && (
                    <button
                      type="button"
                      onClick={() => removeCarouselCard(i)}
                      className="text-[10px] text-text-muted transition-colors hover:text-coral"
                    >
                      {t.dashboard.removeCard}
                    </button>
                  )}
                </div>
                <ImageUpload
                  label=""
                  value={img}
                  onChange={(file, url) => updateCarouselImage(i, file, url)}
                  aspectRatio={imgAspect("adImage")}
                  dimensionHint={
                    i === 0 ? imgHint("adImage") : undefined
                  }
                  platform="facebook"
                  adFormat={data.adFormat}
                />
              </div>
            ))}
          </div>
          {(data.carouselImages || []).length < MAX_CAROUSEL_CARDS && (
            <button
              type="button"
              onClick={addCarouselCard}
              className="flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]"
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
              {t.dashboard.addCard}
              <span className="text-text-muted">
                ({(data.carouselImages || []).length}/{MAX_CAROUSEL_CARDS})
              </span>
            </button>
          )}
        </div>
      ) : (
        <ImageUpload
          label={t.facebook.adImage}
          value={data.adImage}
          onChange={(file, url) => {
            onImageFile("adImage", file);
            onChange({ ...data, adImage: url });
          }}
          aspectRatio={imgAspect("adImage")}
          dimensionHint={imgHint("adImage")}
          platform="facebook"
          adFormat={data.adFormat}
        />
      )}

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
