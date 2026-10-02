export interface BrandOutreachInput {
  creatorName: string;
  creatorNiche: string;
  platform: string;
  followers: string;
  targetBrandCategory: string;
}

export interface BrandOutreachOutput {
  coldDM: string;
  outreachEmail: string;
  mediaKitHighlights: string[];
  followUpMessage: string;
  creatorPitch: string;
}