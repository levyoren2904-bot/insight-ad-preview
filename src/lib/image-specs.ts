/**
 * Platform-specific image specifications.
 * Aspect ratios and recommended dimensions per upload field.
 */

export interface ImageSpec {
  aspectRatio: number;
  width: number;
  height: number;
  label: { en: string; he: string };
}

// Facebook / Instagram
export const facebookImageSpecs: Record<string, Record<string, ImageSpec>> = {
  feed_image: {
    adImage: {
      aspectRatio: 1.91,
      width: 1200,
      height: 628,
      label: { en: "1200×628px (1.91:1)", he: "1200×628px (1.91:1)" },
    },
    profileImage: {
      aspectRatio: 1,
      width: 170,
      height: 170,
      label: { en: "170×170px (square)", he: "170×170px (ריבוע)" },
    },
  },
  carousel: {
    adImage: {
      aspectRatio: 1,
      width: 1080,
      height: 1080,
      label: { en: "1080×1080px (square)", he: "1080×1080px (ריבוע)" },
    },
    profileImage: {
      aspectRatio: 1,
      width: 170,
      height: 170,
      label: { en: "170×170px (square)", he: "170×170px (ריבוע)" },
    },
  },
  story: {
    adImage: {
      aspectRatio: 9 / 16,
      width: 1080,
      height: 1920,
      label: { en: "1080×1920px (9:16)", he: "1080×1920px (9:16)" },
    },
    profileImage: {
      aspectRatio: 1,
      width: 170,
      height: 170,
      label: { en: "170×170px (square)", he: "170×170px (ריבוע)" },
    },
  },
};

// LinkedIn
export const linkedinImageSpecs: Record<string, Record<string, ImageSpec>> = {
  feed_image: {
    adImage: {
      aspectRatio: 1.91,
      width: 1200,
      height: 627,
      label: { en: "1200×627px (1.91:1)", he: "1200×627px (1.91:1)" },
    },
    companyLogo: {
      aspectRatio: 1,
      width: 300,
      height: 300,
      label: { en: "300×300px (square)", he: "300×300px (ריבוע)" },
    },
  },
  carousel: {
    adImage: {
      aspectRatio: 1,
      width: 1080,
      height: 1080,
      label: { en: "1080×1080px (square)", he: "1080×1080px (ריבוע)" },
    },
    companyLogo: {
      aspectRatio: 1,
      width: 300,
      height: 300,
      label: { en: "300×300px (square)", he: "300×300px (ריבוע)" },
    },
  },
};

// Pinterest
export const pinterestImageSpecs: Record<string, ImageSpec> = {
  pinImage: {
    aspectRatio: 2 / 3,
    width: 1000,
    height: 1500,
    label: { en: "1000×1500px (2:3)", he: "1000×1500px (2:3)" },
  },
};
