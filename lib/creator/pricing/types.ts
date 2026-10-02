export type Currency = "INR" | "USD";

export type DealType =
  | "ugc"
  | "influencer"
  | "hybrid"
  | "affiliate"
  | "gifted";

export type NegotiationTone =
  | "friendly"
  | "professional"
  | "firm";

export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "whatsapp";

export type DeliverableFormat =
  | "instagram_reel"
  | "instagram_story"
  | "instagram_static"
  | "instagram_carousel"
  | "tiktok"
  | "youtube_short"
  | "youtube_integration"
  | "youtube_dedicated";

export type FollowerTier =
  | "nano"
  | "micro"
  | "mid"
  | "macro";

export type UsageDuration =
  | "none"
  | "30_days"
  | "90_days"
  | "6_months"
  | "12_months"
  | "perpetual";

export type ExclusivityDuration =
  | "none"
  | "30_days"
  | "60_days"
  | "90_days"
  | "180_days";

export interface DeliverableInput {
  platform: Platform;
  format: DeliverableFormat;
  quantity: number;

  revisions: number;

  rawFootage: boolean;

  scriptByCreator: boolean;

  hookVariants: number;

  staysLive: boolean;

  liveDurationDays?: number;

  linkRequired: boolean;

  brandTagRequired: boolean;
}

export interface AudienceMetrics {
  followers: number;

  medianViews: number;

  averageViews?: number;

  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;

  storyViews?: number;

  followerGrowth3m?: number;

  topCountry?: string;

  cityTier?: string;

  ageGroup?: string;

  gender?: string;

  bestPostViews?: number;
}

export interface CreatorProfile {
  niche: string;

  paidCollabs:
    | "0"
    | "1-3"
    | "4-10"
    | "10+";

  productionQuality:
    | "phone_only"
    | "phone_lighting_mic"
    | "professional";

  editing:
    | "self_edited"
    | "raw";

  portfolioUrl?: string;

  provenResults: boolean;

  provenResultsNote?: string;

  languages: string[];
}

export interface UsageRights {
  paidAds: boolean;

  duration: UsageDuration;

  exclusivity: ExclusivityDuration;

  competitorScope:
    | "none"
    | "narrow"
    | "broad";

  territory:
    | "local"
    | "country"
    | "global";

  brandCanModify: boolean;
}

export interface BrandTerms {
  offerAmount: number;

  productValue?: number;

  commissionPercent?: number;

  brandSize:
    | "startup"
    | "small"
    | "mid"
    | "large";

  brandName?: string;

  paymentTiming:
    | "upfront"
    | "50_50"
    | "on_delivery"
    | "after_post"
    | "net_30"
    | "net_60";

  turnaroundDays: number;

  contractProvided: boolean;

  outreachChannel:
    | "dm"
    | "email"
    | "whatsapp"
    | "agency";

  representedByAgency: boolean;
}

export interface CreatorPreferences {
  minimumRate?: number;

  negotiationTone: NegotiationTone;

  dealImportance:
    | "need_money"
    | "flexible"
    | "can_walk_away";
}

export type ConfidenceLevel =
  | "low"
  | "medium"
  | "high";

export interface AffiliateInputs {
  commissionPercent: number;

  productPrice: number;

  attributionWindowDays?: number;

  estimatedClicks?: number;

  estimatedSales?: number;

  guaranteedMinimumFee?: number;
}

export interface PricingInput {
  currency: Currency;

  dealType: DealType;

  deliverables: DeliverableInput[];

  audience?: AudienceMetrics;

  creator: CreatorProfile;

  usage: UsageRights;

  brand: BrandTerms;

  preferences: CreatorPreferences;

  affiliate?: AffiliateInputs;
}