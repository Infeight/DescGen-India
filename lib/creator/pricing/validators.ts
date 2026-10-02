import type { PricingInput } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePricingInput(
  input: PricingInput
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.dealType) {
    errors.push("Deal type is required.");
  }

  if (!input.creator?.niche) {
    errors.push("Creator niche is required.");
  }

  if (!input.deliverables?.length) {
    errors.push("At least one deliverable is required.");
  }

  for (const deliverable of input.deliverables ?? []) {
    if (deliverable.quantity < 1) {
      errors.push(
        "Deliverable quantity must be at least 1."
      );
    }

    if (deliverable.revisions < 0) {
      errors.push(
        "Number of revisions cannot be negative."
      );
    }

    if (
      deliverable.hookVariants < 1 ||
      deliverable.hookVariants > 5
    ) {
      errors.push(
        "Hook variants must be between 1 and 5."
      );
    }

    if (
      deliverable.liveDurationDays !== undefined &&
      deliverable.liveDurationDays < 0
    ) {
      errors.push(
        "Live duration cannot be negative."
      );
    }
  }

  const requiresAudience =
    input.dealType === "influencer" ||
    input.dealType === "hybrid";

  if (requiresAudience) {
    if (!input.audience) {
      errors.push(
        "Audience metrics are required for influencer and hybrid deals."
      );
    } else {
      if (input.audience.followers <= 0) {
        errors.push(
          "Followers must be greater than 0."
        );
      }

      if (input.audience.medianViews < 0) {
        errors.push(
          "Median views cannot be negative."
        );
      }

      if (
        input.audience.averageViews !== undefined &&
        input.audience.averageViews < 0
      ) {
        errors.push(
          "Average views cannot be negative."
        );
      }

      if (
        input.audience.bestPostViews !== undefined &&
        input.audience.bestPostViews < 0
      ) {
        errors.push(
          "Best post views cannot be negative."
        );
      }

      if (
        input.audience.medianViews >
        (input.audience.bestPostViews ?? Infinity)
      ) {
        warnings.push(
          "Median views appear unusually high compared with the best recent post."
        );
      }
    }
  }

  if (
    input.brand.offerAmount < 0
  ) {
    errors.push(
      "Brand offer cannot be negative."
    );
  }

  if (
    input.brand.productValue !== undefined &&
    input.brand.productValue < 0
  ) {
    errors.push(
      "Product value cannot be negative."
    );
  }

  if (
    input.preferences.minimumRate !== undefined &&
    input.preferences.minimumRate < 0
  ) {
    errors.push(
      "Minimum acceptable rate cannot be negative."
    );
  }

  if (
    input.brand.turnaroundDays < 0
  ) {
    errors.push(
      "Turnaround time cannot be negative."
    );
  }

  if (input.usage.duration === "perpetual") {
    warnings.push(
      "Perpetual usage rights should normally require a significant additional fee."
    );
  }

  if (input.usage.paidAds) {
    warnings.push(
      "Paid advertising usage should be priced separately from content creation."
    );
  }

  if (
    input.brand.paymentTiming === "net_60"
  ) {
    warnings.push(
      "Net-60 payment terms create additional payment risk."
    );
  }

  if (
    input.brand.paymentTiming === "after_post"
  ) {
    warnings.push(
      "Payment after posting increases creator payment risk."
    );
  }

  if (
    input.brand.contractProvided === false
  ) {
    warnings.push(
      "No contract has been provided. Confirm the deal terms in writing."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}