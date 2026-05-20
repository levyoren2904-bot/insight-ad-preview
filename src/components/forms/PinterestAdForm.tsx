"use client";

import { useI18n } from "@/lib/i18n";
import { PinterestAdContent, CHAR_LIMITS } from "@/lib/types";
import TextField from "./shared/TextField";
import ImageUpload from "./shared/ImageUpload";

interface PinterestAdFormProps {
  data: PinterestAdContent;
  onChange: (data: PinterestAdContent) => void;
  onImageFile: (field: string, file: File | null) => void;
}

export default function PinterestAdForm({
  data,
  onChange,
  onImageFile,
}: PinterestAdFormProps) {
  const { t } = useI18n();
  const limits = CHAR_LIMITS.pinterest;

  const update = (field: keyof PinterestAdContent, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label={t.pinterest.pinTitle}
        value={data.pinTitle}
        onChange={(v) => update("pinTitle", v)}
        maxChars={limits.pinTitle}
        required
      />
      <TextField
        label={t.pinterest.pinDescription}
        value={data.pinDescription}
        onChange={(v) => update("pinDescription", v)}
        maxChars={limits.pinDescription}
        multiline
        rows={4}
        required
      />
      <TextField
        label={t.pinterest.destinationUrl}
        value={data.destinationUrl}
        onChange={(v) => update("destinationUrl", v)}
        placeholder="https://..."
        required
      />
      <ImageUpload
        label={t.pinterest.pinImage}
        value={data.pinImage}
        onChange={(file, url) => {
          onImageFile("pinImage", file);
          onChange({ ...data, pinImage: url });
        }}
      />
      <TextField
        label={t.pinterest.boardName}
        value={data.boardName}
        onChange={(v) => update("boardName", v)}
        optional
      />
    </div>
  );
}
