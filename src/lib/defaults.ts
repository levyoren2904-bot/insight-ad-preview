import type {
  GoogleAdContent,
  FacebookAdContent,
  LinkedInAdContent,
  PinterestAdContent,
} from "./types";

export const defaultGoogleAd: GoogleAdContent = {
  companyUrl: "",
  displayPath: "",
  headline1: "",
  headline2: "",
  headline3: "",
  description1: "",
  description2: "",
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
