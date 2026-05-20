"use client";

import { useI18n } from "@/lib/i18n";
import { GoogleAdContent, CHAR_LIMITS } from "@/lib/types";
import { fieldTips } from "@/lib/field-tips";
import TextField from "./shared/TextField";

interface GoogleAdFormProps {
  data: GoogleAdContent;
  onChange: (data: GoogleAdContent) => void;
}

export default function GoogleAdForm({ data, onChange }: GoogleAdFormProps) {
  const { t, locale } = useI18n();
  const limits = CHAR_LIMITS.google;
  const tips = fieldTips.google;

  const tip = (field: string) => tips[field]?.[locale];

  const update = (field: keyof GoogleAdContent, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label={t.google.companyUrl}
        value={data.companyUrl}
        onChange={(v) => update("companyUrl", v)}
        placeholder="www.example.co.il"
        required
        tip={tip("companyUrl")}
      />
      <TextField
        label={t.google.displayPath}
        value={data.displayPath}
        onChange={(v) => update("displayPath", v)}
        placeholder="products"
        optional
        tip={tip("displayPath")}
      />
      <TextField
        label={t.google.headline1}
        value={data.headline1}
        onChange={(v) => update("headline1", v)}
        maxChars={limits.headline1}
        required
        tip={tip("headline1")}
      />
      <TextField
        label={t.google.headline2}
        value={data.headline2}
        onChange={(v) => update("headline2", v)}
        maxChars={limits.headline2}
        required
        tip={tip("headline2")}
      />
      <TextField
        label={t.google.headline3}
        value={data.headline3}
        onChange={(v) => update("headline3", v)}
        maxChars={limits.headline3}
        optional
        tip={tip("headline3")}
      />
      <TextField
        label={t.google.description1}
        value={data.description1}
        onChange={(v) => update("description1", v)}
        maxChars={limits.description1}
        multiline
        required
        tip={tip("description1")}
      />
      <TextField
        label={t.google.description2}
        value={data.description2}
        onChange={(v) => update("description2", v)}
        maxChars={limits.description2}
        multiline
        optional
        tip={tip("description2")}
      />
    </div>
  );
}
