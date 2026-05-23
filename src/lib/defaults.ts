import type {
  GoogleAdContent,
  FacebookAdContent,
  LinkedInAdContent,
  PinterestAdContent,
} from "./types";

export const defaultGoogleAd: GoogleAdContent = {
  companyUrl: "",
  displayPath1: "",
  displayPath2: "",
  headlines: Array.from({ length: 15 }, () => ({ text: "", position: null })),
  descriptions: Array.from({ length: 4 }, () => ({ text: "", position: null })),
};

export const defaultFacebookAd: FacebookAdContent = {
  pageName: "",
  profileImage: null,
  primaryText: "",
  adImage: null,
  headline: "",
  description: "",
  ctaButton: "learn_more",
  adFormat: "feed_image",
};

export const defaultLinkedInAd: LinkedInAdContent = {
  companyName: "",
  companyLogo: null,
  introText: "",
  adImage: null,
  headline: "",
  description: "",
  ctaButton: "learn_more",
  adFormat: "feed_image",
};

export const defaultPinterestAd: PinterestAdContent = {
  pinTitle: "",
  pinDescription: "",
  destinationUrl: "",
  pinImage: null,
  boardName: "",
};
