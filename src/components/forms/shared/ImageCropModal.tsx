"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useI18n } from "@/lib/i18n";

interface ImageCropModalProps {
  imageSrc: string;
  aspectRatio: number;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropModal({
  imageSrc,
  aspectRatio,
  onConfirm,
  onCancel,
}: ImageCropModalProps) {
  const { t } = useI18n();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);

    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } catch {
      onCancel();
    }
  }, [croppedAreaPixels, imageSrc, onConfirm, onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-bg-white shadow-xl">
        {/* Crop area */}
        <div className="relative h-80 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-6 py-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-text-muted"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-light"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {processing ? t.common.loading : t.common.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Creates a cropped image blob from source image and crop area.
 */
async function getCroppedImage(imageSrc: string, crop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      "image/jpeg",
      0.92
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = url;
  });
}
