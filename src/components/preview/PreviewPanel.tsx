"use client";

import { forwardRef } from "react";
import type {
  Platform,
  GoogleAdContent,
  FacebookAdContent,
  LinkedInAdContent,
  PinterestAdContent,
} from "@/lib/types";
import PreviewContainer from "./shared/PreviewContainer";
import GoogleSearchPreview from "./platforms/GoogleSearchPreview";
import FacebookFeedPreview from "./platforms/FacebookFeedPreview";
import InstagramFeedPreview from "./platforms/InstagramFeedPreview";
import LinkedInFeedPreview from "./platforms/LinkedInFeedPreview";
import PinterestPinPreview from "./platforms/PinterestPinPreview";

interface PreviewPanelProps {
  platform: Platform;
  data: {
    google: GoogleAdContent;
    facebook: FacebookAdContent;
    instagram: FacebookAdContent;
    linkedin: LinkedInAdContent;
    pinterest: PinterestAdContent;
  };
}

const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(
  function PreviewPanel({ platform, data }, ref) {
    const renderPreview = () => {
      switch (platform) {
        case "google":
          return <GoogleSearchPreview data={data.google} />;
        case "facebook":
          return <FacebookFeedPreview data={data.facebook} />;
        case "instagram":
          return <InstagramFeedPreview data={data.instagram} />;
        case "linkedin":
          return <LinkedInFeedPreview data={data.linkedin} />;
        case "pinterest":
          return <PinterestPinPreview data={data.pinterest} />;
      }
    };

    return <PreviewContainer ref={ref}>{renderPreview()}</PreviewContainer>;
  }
);

export default PreviewPanel;
