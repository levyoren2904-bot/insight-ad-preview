export type Platform =
  | "google"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "pinterest";

export type SubmissionStatus = "pending" | "approved" | "needs_changes";

export type AdFormat = "feed_image" | "carousel" | "story";

export type CtaOption =
  | "learn_more"
  | "shop_now"
  | "sign_up"
  | "contact_us"
  | "download"
  | "get_offer"
  | "book_now";

export type HeadlinePosition = 1 | 2 | 3 | null;
export type DescriptionPosition = 1 | 2 | null;

export interface GoogleHeadline {
  text: string;
  position: HeadlinePosition;
}

export interface GoogleDescription {
  text: string;
  position: DescriptionPosition;
}

export interface GoogleAdContent {
  companyUrl: string;
  displayPath1: string;
  displayPath2: string;
  headlines: GoogleHeadline[];
  descriptions: GoogleDescription[];
}

export interface FacebookAdContent {
  pageName: string;
  profileImage: string | null;
  primaryText: string;
  adImage: string | null;
  carouselImages: (string | null)[];
  headline: string;
  description: string;
  ctaButton: CtaOption;
  adFormat: AdFormat;
}

export interface InstagramAdContent extends FacebookAdContent {}

export interface LinkedInAdContent {
  companyName: string;
  companyLogo: string | null;
  introText: string;
  adImage: string | null;
  carouselImages: (string | null)[];
  headline: string;
  description: string;
  ctaButton: CtaOption;
  adFormat: Exclude<AdFormat, "story">;
}

export interface PinterestAdContent {
  pinTitle: string;
  pinDescription: string;
  destinationUrl: string;
  pinImage: string | null;
  boardName: string;
}

export type PlatformContent =
  | GoogleAdContent
  | FacebookAdContent
  | InstagramAdContent
  | LinkedInAdContent
  | PinterestAdContent;

export interface Client {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  platforms: Platform[];
  created_at: string;
}

export interface SubmissionLink {
  id: string;
  client_id: string;
  token: string;
  platforms: Platform[];
  expires_at: string | null;
  created_at: string;
  client?: Client;
}

export interface Submission {
  id: string;
  link_id: string;
  client_id: string;
  status: SubmissionStatus;
  admin_notes: string | null;
  published_platforms: Platform[];
  created_at: string;
  updated_at: string;
  client?: Client;
  content?: SubmissionContent[];
}

export interface SubmissionContent {
  id: string;
  submission_id: string;
  platform: Platform;
  content: PlatformContent;
  created_at: string;
}

export interface ImageRecord {
  id: string;
  submission_id: string;
  platform: Platform;
  field_name: string;
  storage_path: string;
  original_filename: string;
  created_at: string;
}

export const PLATFORM_LIST: Platform[] = [
  "google",
  "facebook",
  "instagram",
  "linkedin",
  "pinterest",
];

export const CTA_OPTIONS: CtaOption[] = [
  "learn_more",
  "shop_now",
  "sign_up",
  "contact_us",
  "download",
  "get_offer",
  "book_now",
];

export const CHAR_LIMITS: Record<string, Record<string, number>> = {
  google: {
    headline: 30,
    description: 90,
    displayPath: 15,
  },
  facebook: {
    primaryText: 125,
    headline: 40,
    description: 30,
  },
  instagram: {
    primaryText: 125,
    headline: 40,
    description: 30,
  },
  linkedin: {
    introText: 150,
    headline: 70,
    description: 100,
  },
  pinterest: {
    pinTitle: 100,
    pinDescription: 500,
  },
};
