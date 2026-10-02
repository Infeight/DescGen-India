import {
  PRICING_CONFIG,
  engagementMultipliers,
  geographyMultipliers,
  growthMultipliers,
  territoryMultipliers,
  modificationRightsMultiplier,
  linkPlacementMultiplier,
  liveDurationMultipliers,
} from "./config";

import type {
  AudienceMetrics,
  ConfidenceLevel,
  DeliverableFormat,
  DeliverableInput,
  FollowerTier,
  Platform,
  PricingInput,
} from "./types";

import { validatePricingInput } from "./validators";

export interface PricingLineItem {
  name: string;
  amount: number;
  type:
    | "base"
    | "usage"
    | "ads"
    | "exclusivity"
    | "rush"
    | "revision"
    | "raw"
    | "script"
    | "hooks"
    | "link"
    | "live"
    | "payment";
  reason?: string;
}

export interface DeliverablePricing {
  format: DeliverableFormat;
  platform: Platform;
  quantity: number;
  baseFeePerUnit: number;
  totalBaseFee: number;
}

export interface AffiliateAnalysis {
  estimatedSales: number;
  expectedCommission: number;
  guaranteedMinimumFee: number;
  expectedEarnings: number;
  recommendation: string;
}

export interface PricingResult {
  currency: PricingInput["currency"];
  walkAway: number;
  target: number;
  openingAsk: number;
  tiers: {
    walkAway: number;
    target: number;
    openingAsk: number;
  };
  targetBeforeAddons: number;
  deliverables: DeliverablePricing[];
  addons: PricingLineItem[];
  subtotal: number;
  total: number;
  offer: {
    amount: number;
    gapPercent: number;
    evaluation: "good" | "okay" | "bad";
  };
  offerEvaluation: {
    offer: number;
    gapPercent: number;
    evaluation: "good" | "okay" | "bad";
  };
  confidence: {
    level: ConfidenceLevel;
    score: number;
    reasons: string[];
  };
  warnings: string[];
  assumptions: string[];
  redFlags: string[];
  affiliateAnalysis?: AffiliateAnalysis | null;
}

function getFollowerTier(followers: number): FollowerTier {
  if (followers <= PRICING_CONFIG.followerTiers.nano.max) return "nano";
  if (followers <= PRICING_CONFIG.followerTiers.micro.max) return "micro";
  if (followers <= PRICING_CONFIG.followerTiers.mid.max) return "mid";
  return "macro";
}

function getCPM(platform: Platform): number {
  return (
    PRICING_CONFIG.cpm[platform]?.default ??
    PRICING_CONFIG.cpm.instagram.default
  );
}

function getBaseRate(
  format: DeliverableFormat,
  tier: FollowerTier
): number {
  return PRICING_CONFIG.floorRates[format]?.[tier] ?? 0;
}

function getNicheMultiplier(niche: string): number {
  const normalized = niche.toLowerCase().trim();

  return (
    PRICING_CONFIG.nicheMultipliers[
      normalized as keyof typeof PRICING_CONFIG.nicheMultipliers
    ] ?? PRICING_CONFIG.nicheMultipliers.other
  );
}

function getExperienceMultiplier(
  experience: keyof typeof PRICING_CONFIG.experienceMultipliers
): number {
  return PRICING_CONFIG.experienceMultipliers[experience] ?? 1;
}

function getProductionMultiplier(
  quality: keyof typeof PRICING_CONFIG.productionMultipliers
): number {
  return PRICING_CONFIG.productionMultipliers[quality] ?? 1;
}

function calculateViewsFee(
  medianViews: number,
  platform: Platform
): number {
  return (Math.max(0, medianViews) / 1000) * getCPM(platform);
}

function calculateEngagementMultiplier(
  audience?: AudienceMetrics
): number {
  if (!audience?.followers || audience.followers <= 0) return 1;

  const interactions =
    (audience.likes ?? 0) +
    (audience.comments ?? 0) +
    (audience.shares ?? 0) +
    (audience.saves ?? 0);

  if (interactions <= 0) return 1;

  const engagementRate = (interactions / audience.followers) * 100;

  if (engagementRate >= 10) return engagementMultipliers.exceptional;
  if (engagementRate >= 5) return engagementMultipliers.strong;
  if (engagementRate >= 2) return engagementMultipliers.average;
  return engagementMultipliers.low;
}

function calculateGrowthMultiplier(growth?: number): number {
  if (growth === undefined) return 1;
  if (growth < 0) return growthMultipliers.declining;
  if (growth >= 20) return growthMultipliers.growing;
  return growthMultipliers.stable;
}

function calculateGeographyMultiplier(
  audience?: AudienceMetrics
): number {
  if (!audience?.topCountry) return 1;

  const country = audience.topCountry.toLowerCase();

  if (
    country.includes("united states") ||
    country.includes("usa") ||
    country.includes("united kingdom") ||
    country === "uk" ||
    country.includes("australia") ||
    country.includes("canada")
  ) {
    return geographyMultipliers.global;
  }

  return geographyMultipliers.country;
}

function calculateDeliverable(
  input: PricingInput,
  deliverable: DeliverableInput
): DeliverablePricing {
  const followers = input.audience?.followers ?? 0;
  const tier = getFollowerTier(followers);
  const baseRate = getBaseRate(deliverable.format, tier);

  if (input.dealType === "ugc") {
    let rate = baseRate;

    rate *= getNicheMultiplier(input.creator.niche);
    rate *= getProductionMultiplier(input.creator.productionQuality);
    rate *= getExperienceMultiplier(input.creator.paidCollabs);

    if (input.creator.editing === "self_edited") {
      rate *= 1.1;
    }

    return {
      format: deliverable.format,
      platform: deliverable.platform,
      quantity: deliverable.quantity,
      baseFeePerUnit: Math.round(rate),
      totalBaseFee: Math.round(rate * deliverable.quantity),
    };
  }

  const medianViews = input.audience?.medianViews ?? 0;
  const viewsFee = calculateViewsFee(medianViews, deliverable.platform);

  const blended =
    viewsFee * PRICING_CONFIG.blendWeights.views +
    baseRate * PRICING_CONFIG.blendWeights.baseRate;

  let rate = blended;

  if (input.audience) {
    rate *= calculateEngagementMultiplier(input.audience);
    rate *= calculateGrowthMultiplier(input.audience.followerGrowth3m);
    rate *= calculateGeographyMultiplier(input.audience);
  }

  rate *= getNicheMultiplier(input.creator.niche);
  rate *= getProductionMultiplier(input.creator.productionQuality);
  rate *= getExperienceMultiplier(input.creator.paidCollabs);

  return {
    format: deliverable.format,
    platform: deliverable.platform,
    quantity: deliverable.quantity,
    baseFeePerUnit: Math.round(rate),
    totalBaseFee: Math.round(rate * deliverable.quantity),
  };
}

function calculateAddons(
  input: PricingInput,
  baseTotal: number
): PricingLineItem[] {
  const addons: PricingLineItem[] = [];

  if (input.usage.duration !== "none") {
    const multiplier = PRICING_CONFIG.usageMultipliers[input.usage.duration];

    if (multiplier > 0) {
      addons.push({
        name: `Usage rights - ${input.usage.duration.replace("_", " ")}`,
        amount: Math.round(baseTotal * multiplier),
        type: "usage",
        reason:
          "Additional fee for allowing the brand to use the content beyond the original deliverable.",
      });
    }
  }

  if (input.usage.paidAds) {
    addons.push({
      name: "Paid advertising / whitelisting",
      amount: Math.round(
        baseTotal * PRICING_CONFIG.paidAdsMultiplier.standard
      ),
      type: "ads",
      reason: "Paid media usage is priced separately from organic content.",
    });
  }

  if (input.usage.exclusivity !== "none") {
    const exclusivity =
      PRICING_CONFIG.exclusivityMultipliers[input.usage.exclusivity];
    const scope = input.usage.competitorScope;

    if (exclusivity && scope !== "none") {
      const multiplier = exclusivity[scope as "narrow" | "broad"];

      addons.push({
        name: `Exclusivity - ${input.usage.exclusivity.replace("_", " ")}`,
        amount: Math.round(baseTotal * multiplier),
        type: "exclusivity",
        reason:
          "Compensation for restricting future brand and competitor collaborations.",
      });
    }
  }

  if (input.brand.turnaroundDays < 5) {
    addons.push({
      name: "Rush delivery",
      amount: Math.round(
        baseTotal * PRICING_CONFIG.rushMultiplier.standard
      ),
      type: "rush",
      reason: "Rush premium for turnaround under 5 days.",
    });
  }

  const paymentMultiplier =
    PRICING_CONFIG.paymentRiskMultipliers[input.brand.paymentTiming];

  if (paymentMultiplier > 0) {
    addons.push({
      name: "Payment timing risk",
      amount: Math.round(baseTotal * paymentMultiplier),
      type: "payment",
      reason: "Additional risk from delayed payment terms.",
    });
  }

  if (input.deliverables.some((deliverable) => deliverable.rawFootage)) {
    addons.push({
      name: "Raw footage",
      amount: Math.round(
        baseTotal * PRICING_CONFIG.rawFootageMultiplier
      ),
      type: "raw",
      reason:
        "Raw footage gives the brand additional reusable production material.",
    });
  }

  if (input.deliverables.some((deliverable) => deliverable.scriptByCreator)) {
    addons.push({
      name: "Creator scripting",
      amount: Math.round(
        baseTotal * PRICING_CONFIG.creatorScriptMultiplier
      ),
      type: "script",
      reason:
        "Additional creative work when the creator develops the script.",
    });
  }

  const extraRevisions = input.deliverables.reduce(
    (total, deliverable) =>
      total + Math.max(0, deliverable.revisions - 2),
    0
  );

  if (extraRevisions > 0) {
    addons.push({
      name: `Extra revisions (${extraRevisions})`,
      amount: Math.round(
        baseTotal * PRICING_CONFIG.extraRevisionRate * extraRevisions
      ),
      type: "revision",
      reason: "Revisions beyond the two included revisions.",
    });
  }

  const extraHooks = input.deliverables.reduce(
    (total, deliverable) =>
      total + Math.max(0, deliverable.hookVariants - 1),
    0
  );

  if (extraHooks > 0) {
    addons.push({
      name: `Additional hook variants (${extraHooks})`,
      amount: Math.round(
        baseTotal * PRICING_CONFIG.extraHookRate * extraHooks
      ),
      type: "hooks",
      reason: "Additional creative hook variations requested.",
    });
  }

  if (input.deliverables.some((deliverable) => deliverable.linkRequired)) {
    addons.push({
      name: "Link placement",
      amount: Math.round(baseTotal * linkPlacementMultiplier),
      type: "link",
      reason: "Link placement creates an additional distribution requirement.",
    });
  }

  const liveDurationAddons = input.deliverables.reduce(
    (sum, deliverable) => {
      if (!deliverable.staysLive || !deliverable.liveDurationDays) {
        return sum;
      }

      const days = deliverable.liveDurationDays;
      let multiplier = 0;

      if (days >= 90) {
        multiplier = liveDurationMultipliers[90];
      } else if (days >= 60) {
        multiplier = liveDurationMultipliers[60];
      } else if (days >= 30) {
        multiplier = liveDurationMultipliers[30];
      }

      return sum +
        (multiplier > 0 ? Math.round(baseTotal * multiplier) : 0);
    },
    0
  );

  if (liveDurationAddons > 0) {
    addons.push({
      name: "Extended live duration",
      amount: liveDurationAddons,
      type: "live",
      reason:
        "The brand keeps the content live for longer than the standard posting window.",
    });
  }

  if (input.usage.territory !== "local") {
    const multiplier = territoryMultipliers[input.usage.territory];

    if (multiplier > 0) {
      addons.push({
        name: `${input.usage.territory} usage territory`,
        amount: Math.round(baseTotal * multiplier),
        type: "usage",
        reason: "Wider distribution territory adds commercial value.",
      });
    }
  }

  if (input.usage.brandCanModify) {
    addons.push({
      name: "Modification rights",
      amount: Math.round(baseTotal * modificationRightsMultiplier),
      type: "usage",
      reason: "The brand can edit or modify the delivered content.",
    });
  }

  return addons;
}

function calculateAffiliate(input: PricingInput): AffiliateAnalysis | null {
  if (input.dealType !== "affiliate" || !input.affiliate) {
    return null;
  }

  const affiliate = input.affiliate;
  const estimatedSales =
    affiliate.estimatedSales ??
    Math.round((affiliate.estimatedClicks ?? 0) * 0.03);

  const expectedCommission =
    estimatedSales *
    affiliate.productPrice *
    (affiliate.commissionPercent / 100);

  const guaranteedMinimumFee = affiliate.guaranteedMinimumFee ?? 0;
  const expectedEarnings = expectedCommission + guaranteedMinimumFee;

  return {
    estimatedSales,
    expectedCommission: Math.round(expectedCommission),
    guaranteedMinimumFee: Math.round(guaranteedMinimumFee),
    expectedEarnings: Math.round(expectedEarnings),
    recommendation:
      expectedEarnings > 0
        ? "Compare expected affiliate earnings with the fixed-fee target before accepting."
        : "Ask for a guaranteed fee or clearer tracking before relying on commission-only compensation.",
  };
}

function calculateConfidence(input: PricingInput): {
  level: ConfidenceLevel;
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 55;

  if (input.audience) {
    score += 15;
    reasons.push("Audience metrics are available.");

    if (input.audience.medianViews > 0) {
      score += 5;
      reasons.push("Median views are available.");
    }

    if (input.audience.topCountry) {
      score += 3;
      reasons.push("Audience geography is available.");
    }

    if (input.audience.followerGrowth3m !== undefined) {
      score += 2;
      reasons.push("Recent follower growth is available.");
    }
  } else if (input.dealType === "ugc") {
    reasons.push(
      "Audience data was not provided; pricing relies more on creator profile."
    );
  } else {
    reasons.push(
      "Audience data is missing; confidence is lower for influencer and hybrid deals."
    );
  }

  if (input.creator.provenResults) {
    score += 10;
    reasons.push("Creator has proven results in this niche.");
  } else {
    reasons.push("No proven results were supplied.");
  }

  if (input.deliverables.length > 0) {
    score += 5;
  }

  if (input.brand.contractProvided) {
    score += 10;
    reasons.push("Contract terms are documented.");
  } else {
    reasons.push("Contract terms are not yet confirmed.");
  }

  if (
    input.usage.duration === "perpetual" ||
    input.usage.paidAds ||
    input.brand.paymentTiming === "net_60"
  ) {
    score -= 5;
  }

  score = Math.max(20, Math.min(95, score));

  let level: ConfidenceLevel = "medium";

  if (score >= 80) {
    level = "high";
  } else if (score < 50) {
    level = "low";
  }

  return {
    level,
    score: Math.round(score),
    reasons,
  };
}

function generateRedFlags(
  input: PricingInput,
  target: number,
  walkAway: number
): string[] {
  const flags: string[] = [];

  if (input.brand.offerAmount < walkAway) {
    flags.push("The cash offer is below your calculated walk-away price.");
  }

  if (input.usage.duration === "perpetual") {
    flags.push("The brand is requesting perpetual content usage.");
  }

  if (input.usage.paidAds) {
    flags.push("Paid advertising rights are included.");
  }

  if (input.usage.exclusivity !== "none") {
    flags.push(
      `Exclusivity requested for ${input.usage.exclusivity.replace("_", " ")}.`
    );
  }

  if (input.brand.paymentTiming === "net_60") {
    flags.push("Payment is scheduled for Net 60.");
  }

  if (input.brand.paymentTiming === "after_post") {
    flags.push("Payment depends on the content going live.");
  }

  if (!input.brand.contractProvided) {
    flags.push("No contract has been provided yet.");
  }

  if (input.brand.turnaroundDays <= 2) {
    flags.push("The requested turnaround is very short.");
  }

  const offerValue =
    input.brand.offerAmount + (input.brand.productValue ?? 0);

  if (offerValue > 0 && offerValue < target * 0.5) {
    flags.push(
      "The effective offer is substantially below the calculated target."
    );
  }

  return flags;
}

export function calculatePricing(input: PricingInput): PricingResult {
  const validation = validatePricingInput(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const deliverables = input.deliverables.map((deliverable) =>
    calculateDeliverable(input, deliverable)
  );

  const baseTotal = deliverables.reduce(
    (sum, item) => sum + item.totalBaseFee,
    0
  );

  const addons = calculateAddons(input, baseTotal);
  const addonsTotal = addons.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const target = Math.max(0, Math.round(baseTotal + addonsTotal));
  let walkAway = Math.round(target * PRICING_CONFIG.tiers.walkAway);
  const openingAsk = Math.round(
    target * PRICING_CONFIG.tiers.openingAsk
  );

  if (input.preferences.minimumRate !== undefined) {
    walkAway = Math.max(
      walkAway,
      input.preferences.minimumRate
    );
  }

  const offerAmount =
    input.brand.offerAmount + (input.brand.productValue ?? 0);

  const evaluation: "good" | "okay" | "bad" =
    offerAmount >= target
      ? "good"
      : offerAmount >= walkAway
        ? "okay"
        : "bad";

  const gapPercent =
    target > 0
      ? Math.round(((target - offerAmount) / target) * 100)
      : 0;

  const confidence = calculateConfidence(input);
  const redFlags = generateRedFlags(input, target, walkAway);
  const affiliateAnalysis = calculateAffiliate(input);

  const offerEvaluation = {
    offer: offerAmount,
    gapPercent,
    evaluation,
  };

  return {
    currency: input.currency,
    walkAway,
    target,
    openingAsk,
    tiers: {
      walkAway,
      target,
      openingAsk,
    },
    targetBeforeAddons: baseTotal,
    deliverables,
    addons,
    subtotal: baseTotal,
    total: target,
    offer: {
      amount: offerAmount,
      gapPercent,
      evaluation,
    },
    offerEvaluation,
    confidence,
    warnings: validation.warnings,
    assumptions: [
      "Pricing is an estimate based on the information provided.",
      "Actual creator-brand rates vary by market, audience quality, brand budget and negotiation.",
      "Pricing constants are configurable product assumptions, not guaranteed market benchmarks.",
      "Confirm payment, usage rights, exclusivity and deliverables in writing before accepting.",
    ],
    redFlags,
    affiliateAnalysis,
  };
}
