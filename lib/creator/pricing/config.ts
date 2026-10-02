import type {
  DeliverableFormat,
  Platform,
} from "./types";

export const PRICING_CONFIG = {
  currency: "INR" as const,

  blendWeights: {
    views: 0.6,
    baseRate: 0.4,
  },

  followerTiers: {
    nano: {
      min: 0,
      max: 10_000,
    },

    micro: {
      min: 10_001,
      max: 50_000,
    },

    mid: {
      min: 50_001,
      max: 250_000,
    },

    macro: {
      min: 250_001,
      max: Infinity,
    },
  },

  /*
   * These are initial product estimates.
   * They are NOT claimed industry-standard rates.
   *
   * Tune these as DescGen collects anonymized
   * creator/deal data.
   */

  cpm: {
    instagram: {
      default: 250,
    },

    tiktok: {
      default: 200,
    },

    youtube: {
      default: 350,
    },

    whatsapp: {
      default: 150,
    },
  },

  floorRates: {
    instagram_reel: {
      nano: 1500,
      micro: 3500,
      mid: 8000,
      macro: 15000,
    },

    instagram_story: {
      nano: 750,
      micro: 1500,
      mid: 3500,
      macro: 7000,
    },

    instagram_static: {
      nano: 1000,
      micro: 2500,
      mid: 5000,
      macro: 10000,
    },

    instagram_carousel: {
      nano: 1500,
      micro: 3000,
      mid: 6000,
      macro: 12000,
    },

    tiktok: {
      nano: 1500,
      micro: 3500,
      mid: 7500,
      macro: 15000,
    },

    youtube_short: {
      nano: 2000,
      micro: 4500,
      mid: 9000,
      macro: 18000,
    },

    youtube_integration: {
      nano: 4000,
      micro: 8000,
      mid: 15000,
      macro: 30000,
    },

    youtube_dedicated: {
      nano: 7500,
      micro: 15000,
      mid: 30000,
      macro: 60000,
    },
  } satisfies Record<
    DeliverableFormat,
    Record<
      "nano" | "micro" | "mid" | "macro",
      number
    >
  >,

  nicheMultipliers: {
    finance: 1.3,
    tech: 1.2,
    b2b: 1.25,
    beauty: 1.05,
    fashion: 1.0,
    food: 1.0,
    fitness: 1.05,
    parenting: 1.05,
    travel: 1.05,
    gaming: 1.05,
    education: 1.1,
    lifestyle: 0.95,
    other: 1.0,
  },

  productionMultipliers: {
    phone_only: 0.9,
    phone_lighting_mic: 1.0,
    professional: 1.2,
  },

  experienceMultipliers: {
    "0": 0.9,
    "1-3": 1.0,
    "4-10": 1.1,
    "10+": 1.2,
  },

  usageMultipliers: {
    none: 0,
    "30_days": 0.25,
    "90_days": 0.45,
    "6_months": 0.75,
    "12_months": 1.0,
    perpetual: 1.75,
  },

  paidAdsMultiplier: {
    none: 0,
    standard: 0.5,
  },

  rawFootageMultiplier: 0.2,

  creatorScriptMultiplier: 0.15,

  rushMultiplier: {
    none: 0,
    standard: 0.35,
  },

  extraRevisionRate: 0.08,

  extraHookRate: 0.05,

  exclusivityMultipliers: {
    none: 0,

    "30_days": {
      narrow: 0.15,
      broad: 0.2,
    },

    "60_days": {
      narrow: 0.25,
      broad: 0.35,
    },

    "90_days": {
      narrow: 0.4,
      broad: 0.5,
    },

    "180_days": {
      narrow: 0.65,
      broad: 0.8,
    },
  },

  paymentRiskMultipliers: {
    upfront: 0,
    "50_50": 0,
    on_delivery: 0.05,
    after_post: 0.1,
    net_30: 0.05,
    net_60: 0.1,
  },

  tiers: {
    walkAway: 0.8,
    openingAsk: 1.25,
  },
};


export const engagementMultipliers = {
  low: 0.9,
  average: 1,
  strong: 1.1,
  exceptional: 1.2,
};

export const geographyMultipliers = {
  local: 0.9,
  country: 1,
  global: 1.2,
};

export const growthMultipliers = {
  declining: 0.9,
  stable: 1,
  growing: 1.1,
};

export const territoryMultipliers = {
  local: 0,
  country: 0.05,
  global: 0.15,
};

export const modificationRightsMultiplier = 0.15;

export const linkPlacementMultiplier = 0.1;

export const liveDurationMultipliers = {
  30: 0.05,
  60: 0.08,
  90: 0.12,
};

export const giftedProductCashFactor = 0.5;