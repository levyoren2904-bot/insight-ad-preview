"use client";

import { useCallback, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
  optional?: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({
  label,
  value,
  onChange,
  optional = true,
}: ImageUploadProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("JPG, PNG, WebP only");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(t.submission.maxFileSize);
        return;
      }
      const url = URL.createObjectURL(file);
      onChange(file, url);
    },
    [onChange, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
  }, [onChange]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        {optional && (
          <span className="text-xs text-text-muted">
            {t.common.optional}
          </span>
        )}
      </div>

      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute end-2 top-2 rounded-full bg-bg-white/90 p-1 text-text-secondary shadow-sm transition-colors hover:text-coral"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-text-muted"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <span className="text-sm text-text-muted">
            {t.submission.dragOrClick}
          </span>
          <span className="text-xs text-text-muted">
            {t.submission.maxFileSize}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />

      {error && <span className="text-xs text-coral">{error}</span>}
    </div>
  );
}
